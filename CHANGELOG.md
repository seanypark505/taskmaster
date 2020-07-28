Changelog
=========

## 1.0 - 2020-05-25
First released version of Taskmaster only had the functionality of creating a To Do item.
However, there was no database to perform CRUD operations.

## 2.0 - <!-- 2020-07-? -->
### Added
- Connected Taskmaster to MongoDB 4.2 to store To Do list items.
- Mongoose v5.9.25 being used to provide schema validation and CRUD operations.
- Lodash library added so that custom lists routes were not being duplicated due to string case.
- Ability for user to create custom named lists by adding in their desired list name after the '/' route in the browser.
- Default To Do list items acting as an intro and how-to guide.
- Links in the footer for the Home page and About page.
- README.md
- CHANGELOG.md was added in this version.
- ISC License

### Removed
- date.js and code to display local date and time for the user.

### Changed
- Color Scheme.
- Code was refactored.

### Upcoming
- Theme selector to change color scheme of the web app.
- Input form to create a new list.
- Drop down menu to select custom lists created.
- User ability to modify and update a list item.
