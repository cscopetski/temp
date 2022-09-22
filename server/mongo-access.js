import { collection } from "../server.js";
import bcrypt from "bcrypt";

export function getUser(userData) {
  return new Promise((resolve, reject) => {
    collection
      .find({ email: userData.email })
      .limit(1)
      .toArray((err, res) => {
        err ? reject(err) : resolve(res[0]);
      });
  });
}

export async function addUser(userData) {
  const checkUser = await getUser(userData);
  console.log("Check User: " + checkUser);
  if (checkUser !== undefined) {
    if (checkUser.length > 0) {
      console.log("User already exists");
      throw new Error("User already exists");
    }
  } else {
    return await collection.insertOne(userData, async (err, res) => {
      if (err) {
        console.log(err);
        throw new Error(err);
      }
      console.log(res);
      return res.insertedId;
    });
  }
}

export async function loginUser(userData) {
  let checkUser = await getUser(userData);
  console.log("Check User: " + checkUser);
  if (checkUser !== undefined) {
    console.log("User already exists");
    if (userData.password === null) {
      return { email: userData.email, login: true };
    } else {
      const result = await bcrypt.compare(
        userData.password,
        checkUser.password
      );

      if (result == true) {
        console.log("Check User: " + checkUser);
        return { email: userData.email, login: true };
      } else {
        throw new Error("Invalid password");
      }
    }
  } else {
    if (userData.password !== null) {
      return bcrypt.genSalt().then((salt) => {
        return bcrypt.hash(userData.password, salt).then((password) => {
          userData.password = password;
          userData.foods = [];
          return new Promise((resolve, reject) => {
            collection.insertOne(userData, (err, res) => {
              if (err) {
                reject(err);
              } else {
                console.log("User does not exist, creating user");
                resolve({ email: userData.email, login: false });
              }
            });
          });
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        collection.insertOne(userData, (err, res) => {
          if (err) {
            reject(err);
          } else {
            console.log("User does not exist, creating user");
            resolve({ email: userData.email, login: false });
          }
        });
      });
    }
  }
}

export function getUserFoods(email) {
  return new Promise((resolve, reject) => {
    collection.find({ email: email }).toArray((err, res) => {
      console.log(res);
      let result = [];
      try {
        result = res[0].foods ? res[0].foods : [];
      } catch (error) {
        result = [];
      }

      err ? reject(err) : resolve(result);
    });
  });
}

export function addFood(email, food) {
  return new Promise((resolve, reject) => {
    collection
      .updateOne({ email: email }, { $push: { foods: food } })
      .then((res) => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function editFood(email, food) {
  return new Promise((resolve, reject) => {
    collection
      .updateOne(
        { email: email, "foods.id": food.id },
        { $set: { "foods.$": food } }
      )
      .then((res) => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export async function deleteFoods(email, food_ids) {
  return new Promise((resolve, reject) => {
    collection
      .updateMany(
        { email: email },
        { $pull: { foods: { id: { $in: food_ids } } } }
      )
      .then((res) => {
        console.log(food_ids);
        resolve(food_ids);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
