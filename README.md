## Grocery List Tracker - CS4241 Assignment 2
#### Caleb Scopetski https://a2-cscopetski.glitch.me
A simple grocery tracker. Allows the user to add a food item to a list of food items and delete items from the list.

Food items have a name, type, weight, price, and a derived field, price per pound 

**CSS Positioning**: Flex-Box

## Technical Achievements
- **Tech Achievement 1**: Used post requests to send data to backend server and return a response containing updated app data. Response is then received on front-end and displayed immediately by calling ``reloadList()`` to reload the food table with new data .

## Design/Evaluation Achievements
- **Design Achievement 1**: 
The task given to the UI testers was to add a food to the list, then delete the food from the list.
    - **Person 1**:
    1. Noonan
    2. Didnt like selecting the food before clicking delete button. Thought clicking delete, then clicking on the foods they want to delete was more intuitive
    3. The problem with selecting foods then clicking delete surprised me. I originally thought that selecting the food before deleting it made more sense, but after talking through it I realized entering a "delete mode" to delete list items could be more intuitive.
    4. Based on the feedback I would change the checkbox selection method for deleting list items to a delete mode, where after clicking the delete button clicked items get deleted from the list.

    - **Person 2**:
    1. Zhang
    2. Had a problem with the text input and number input fields being pre-filled with default values. Felt that having to clear the field before inputting value was tedious.
    3. I was surprised by a comment about the radio buttons. They mentioned that they would have prefered them stacked vertically instead of in a row.
    4. Based on the feedback I would remove the pre-filled default values from the input fields and look into an alternative way of showing users what to enter into the input field.
