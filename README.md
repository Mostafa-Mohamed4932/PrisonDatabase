# PrisonDatabase
 
This project is a web application that provides a database system for managing inmates, cell blocks, guards, cells, and shifts in a prison. The system is built using Microsoft SQL Server for the database management and Node.js with Pug and JavaScript for the web development.

The database schema includes tables for inmates, cell blocks, guards, cells, and shifts. The inmates table includes personal information, such as name, ID, and sentence details, as well as cell assignments. The cell blocks table includes details about the different cell blocks in the prison, such as their names, capacities, and current occupancy. The guards table includes information about the guards, including their names and assigned cell blocks. The cells table includes details about individual cells, such as their numbers, cell block assignments, and current occupancy. The shifts table includes information about the guards' work shifts, including their start and end times and assigned cell blocks.

The web interface allows authorized users to add, edit, and delete records, search for inmates, and generate reports. The application is designed to be secure and efficient, reducing paperwork and errors and improving transparency and accountability.

To run the application, you need to have Microsoft SQL Server installed and create a database instance with the provided schema. Then, you need to configure the Node.js server to connect to the database and start the web application. The code includes comments and documentation to guide you through the setup process.

Overall, this project aims to provide a comprehensive solution for managing prison data, helping prison administrators to track inmate movements, guard assignments, cell block occupancy, and shift schedules.
