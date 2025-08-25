Kindergarten Management 🏫
This is a simple web application project built with React to facilitate the management of staff, children, and parents in a kindergarten.

Features ✨
Staff Management: A list to manage staff data.

Children Management: A list to manage children's data, based on the design of the staff list.

Parent Management: A list to manage parent and contact information. This component combines the first and last names into a single Name column and includes an additional column for the Address.

Data Management: New entries can be added, existing ones can be edited, and entries can be deleted for each section.

Search & Filter: An integrated search function allows for quickly finding entries.

Components 🧩
mitarbeiter.js
The original component that serves as the template for the entire design. It manages basic staff information, including name, location, email, phone number, role, and login details.

kinder.js
This component was developed based on the mitarbeiter.js design. It manages the children's data, including first name, last name, location, and parents.

eltern.js
A direct copy and adaptation of mitarbeiter.js to manage parent data. The list combines first and last name into a single Name column and includes an additional column for the Address.

Installation and Start 🚀
To run the project locally, follow these steps:

✅ Ensure that Node.js and npm (or yarn) are installed on your system.

✅ Clone this repository to a local directory.

✅ Open the terminal in the project directory and install the dependencies:

npm install

✅ Start the development server:

npm start

✅ The application should automatically open in your browser (usually at http://localhost:3000).

Usage 🖱️
Navigate through the different components to manage staff, children, and parent data. Use the buttons to add, edit, or delete entries. The search bar allows you to filter the data and quickly find the information you need.
