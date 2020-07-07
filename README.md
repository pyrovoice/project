# Project

Angular project showing a skillset in the technology.

# Goal 

CRUD management of a building and its floors, sections and products.

# Restrictions

- 2 hours time limit
- Simulated backend
- No frontend design framework (like bootstrap)
- All data displayed in one page

# Design choices

- Floor are the big object that the client will have 2 or 3 assigned to, and will want to do a lot of work with only this object. Changing floors is not an action that should be done often, so a dropdown with search functionality (TODO) best fits. (even probably a parent component from where you select your environment, that opens the sections and products, given more time).
- Sections you want to be able to switch easily to see what is where on your floor, and it should scale up nicely to 10-15 items. A Flexbox seems to fit, though with too large a number we might want to rethink the design to nicely fit them all.
- Finally we want to display products' information in an easy and efficient way, thus the table.

Also some actions could be moved to the navbar when we have more screens.

Finally I went for a responsive design that should tell the user exactly what is possible and where they can click at a glance, but it is made for mouse users. A different design should be thought for Mobile/Tablet users, as they cannot hover over items.

# What to improve

- Add bootstrap
- Separate a floor and its sections/products in the view
- Reset button on the forms 
