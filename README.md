Daniel Hardeman
CSCI-4560-001
Homework 5
11/21/2026

====================================================================================
DESCRIPTION
====================================================================================
My implementation of homework 5 is a web application consisting of the following:
- a front end hosted in the cloud with Render
- a FastAPI backend hosted in the cloud with Render
- a POSTGRESQL database hosted in the cloud with Aiven

In order to remain in Aiven's free-to-use tier, I added the tables this assignment
uses to the database of my Final Project. So I have 1 database that contains all
the tables for my final project and this assignment - but this assignment only
accesses the tables from the homework 3/4 database with Suppliers/Parts/Shipments.

====================================================================================
HOW TO ACCESS
====================================================================================

Since everything is in the cloud, all you need to do to access the application is
go to the following url in any web browser:

https://csci-4560-hw5-1.onrender.com/

====================================================================================
NOTE ON RENDER
====================================================================================

Render allows web services to be hosted in the cloud for free if they do not exceed
the usage limits, which is why I chose it for both my final project and this
assignemnt. But one thing to know about this is that free-tier web services are spun
down after a period of inactivity, so when you access it after it has been spun down,
it can take a minute for it to boot back up. So if it takes a while to initially load up
or for the first query to execute, this is why.

====================================================================================
USAGE INSTRUCTIONS
====================================================================================

Each of the 5 operations outlined in the instructions have an 'Execute' button next
to them in the UI that runs the query against the database. The results of each query
are shown in the window at the bottom of the UI.

For the first 2 INSERT queries, you can insert the shipments as many times as you want - I allowed this because technically the same order for the same part from the same supplier in the same quantity could be made any number of times.

Each time you execute the 3rd query, it increases the status of all Suppliers by 10%

For the 5th query, where it shows all Suppliers that ship a selected part, there is
a text box next to the 'Execute' button where you can enter a part number from the
Parts database (p1, p2, p3, p4, or p5). If one of these values is not entered into
the text box, it will display a message telling you the valid part numbers you can
enter.

====================================================================================
DEMO VIDEO URL
====================================================================================

