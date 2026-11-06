# EcoCollect

EcoCollect is an electronics recycling collection website created for a CSE326 web development project. It helps households and businesses record e-waste pickup requests and manage their collection progress.

## Features

- Brief information about electronic recycling.
- A pickup form for contact details, address, item category, quantity, notes, date and time window.
- Collector assignment and checks for conflicting pickup slots.
- Request statuses of Pending, Assigned, Collected and Recycled.
- Summary counters, status filtering and collection history.
- A responsive layout for desktop and mobile screens.
- Browser storage for saved requests and a contact email link.

## Project files

| File | Purpose |
| --- | --- |
| `EcoCollexct.html` | Page content, pickup form, request table, history and contact section. |
| `style.css` | Colours, spacing, form styling and responsive layout. |
| `script.js` | Validation, collector assignment, status updates and saved requests. |

## Technologies used

- HTML for page structure, forms, tables and links.
- CSS for appearance and responsive layout.
- JavaScript for functions, loops, arrays, objects and page updates.
- localStorage and JSON for saving requests in the browser.

The project uses the HTML, CSS and JavaScript topics covered in the supplied course materials.

## How to run

1. Keep `EcoCollexct.html`, `style.css` and `script.js` in the same folder.
2. Open `EcoCollexct.html` in a modern web browser.
3. Enable JavaScript and allow browser storage to save requests between visits.

## How to use

1. Fill in the pickup form and select **Send pickup request**. The request starts as **Pending**.
2. Choose a collector in the requests table. Its status becomes **Assigned**.
3. Select **Mark collected** when the pickup is complete.
4. Select **Mark recycled** when processing is complete.
5. Use the status filter and collection history to review requests.

Selecting **Unassigned** returns an assigned request to Pending. Counters update automatically as requests change.

## Input validation

The form checks required fields, phone numbers containing 7 to 15 digits, whole quantities from 1 to 200, and pickup dates from today onward. Collector assignment also checks for another assigned pickup in the same date and time window.

## Data storage

Requests and status changes are stored in the browser on the device being used. Clearing the site's browser data removes those saved records.

If browser storage is unavailable, requests remain available until the page is refreshed. The page displays a message explaining this.

Collection assignments and recycling statuses are updated manually through the website.

## Contact

[vikram.bhardwaj200710@gmail.com](mailto:vikram.bhardwaj200710@gmail.com)

The email link opens the user's email application.
