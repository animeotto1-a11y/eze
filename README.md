# React 3D Gallery Pagination

A responsive **3D image gallery and pagination project** built with **React, Axios, Tailwind CSS, and the Picsum Photos API**.

The project fetches image data dynamically through an API and presents it in an interactive 3D card layout with a centered featured card, side cards, smooth transitions, pagination, mouse-wheel navigation, and mobile touch/swipe support.

> **Note:** The project uses `picsum.photos/seed/nature...` for the displayed image URLs. The `nature` seed is used as part of the image URL, but Picsum does **not guarantee that every returned image is specifically a nature photograph**.

---

## ✨ Features

* 🎨 Responsive 3D image gallery interface
* 🔄 Dynamic image data fetching with Axios
* 🌐 Picsum Photos API integration
* 📄 Page-based pagination
* 🖼️ 60 images loaded per API page
* ⭐ Center featured card with 3D perspective layout
* ↔️ Previous/Next card navigation
* 🖱️ Mouse-wheel navigation
* 📱 Mobile touch/swipe navigation
* 🎞️ Dynamic full-screen background based on the active image
* 🔍 Hover image zoom effect
* 🌫️ Glassmorphism-inspired UI
* 💫 Smooth card transitions and animations
* ⏳ Loading skeleton UI
* 📐 Responsive layouts for different screen sizes
* 🖼️ Lazy-loaded gallery images
* 🔢 Active image counter
* 🆔 Picsum image ID display

---

## 🛠️ Tech Stack

* **React** — Component-based UI development
* **Axios** — HTTP requests and API data fetching
* **Tailwind CSS** — Styling and responsive UI
* **JavaScript (ES6+)** — Application logic
* **Picsum Photos API** — Dynamic image data
* **React Hooks** — State, effects, refs and interaction handling

### React Hooks Used

* `useState`
* `useEffect`
* `useRef`

---

## 🔌 API Integration

The project uses the Picsum Photos API to dynamically retrieve image information.

### API Endpoint

```text
https://picsum.photos/v2/list?page={page}&limit=60
```

The current pagination state determines which API page is requested.

For example:

```text
https://picsum.photos/v2/list?page=1&limit=60
```

The API response is processed and transformed before being stored in React state.

---

## 📊 How Pagination Works

The application maintains the current page through React state:

```js
const [index, setIndex] = useState(1)
```

Whenever the page changes, `useEffect` triggers the API request again:

```js
useEffect(function () {
  getData();
}, [index])
```

### Previous Page

The previous page button decreases the page number while preventing navigation below page 1.

### Next Page

The next page button increases the page number and requests the next set of images.

When a new page is requested, the current gallery data is cleared before the new API response is displayed.

---

## 🎴 3D Gallery System

The gallery uses the difference between each card's index and the active card index to determine its visual position.

```js
const offset = idx - activeIndex;
```

Cards are then positioned according to their distance from the active card.

### Center Card

The active card is displayed as the main featured card with:

* Larger scale
* Full opacity
* No blur
* Higher z-index
* Center positioning
* 3D perspective styling

### Adjacent Cards

Cards immediately next to the active card receive:

* Reduced scale
* Reduced opacity
* Horizontal positioning
* Y-axis rotation
* Slight blur

### Outer Cards

Cards farther away from the active card are visually pushed toward the edges and eventually hidden.

This creates the layered 3D carousel-style gallery effect.

---

## 🖱️ Mouse Wheel Navigation

The gallery supports navigation through the mouse wheel.

Scrolling horizontally or vertically changes the active card.

A short cooldown is used to prevent excessive navigation events:

```js
setTimeout(() => {
  isScrolling.current = false
}, 250)
```

---

## 📱 Mobile Swipe Navigation

Touch events are handled through `useRef` and touch event listeners.

The project records the starting X position:

```js
touchStartX.current = e.touches[0].clientX
```

and compares it with the ending position.

A minimum swipe distance of `40px` is required before changing the active card.

This allows the gallery to work with both:

* Mouse interaction
* Touch interaction

---

## 🖼️ Dynamic Background

The active gallery image is also used as the full-screen background.

```js
userData[activeIndex]?.download_url
```

The background image is:

* Full-screen
* Slightly scaled
* Blurred
* Darkened with an overlay
* Updated according to the active card

This creates a visual connection between the featured card and the page background.

---

## 🧩 Component Structure

The project currently uses a simple component structure:

```text
src/
├── components/
│   └── Card.jsx
├── App.jsx
├── index.css
└── main.jsx
```

### `App.jsx`

Responsible for:

* API requests
* Pagination
* Gallery state
* Active card state
* Mouse-wheel navigation
* Touch/swipe navigation
* 3D card positioning
* Dynamic background
* Loading state
* Gallery controls

### `Card.jsx`

Responsible for rendering an individual gallery card, including:

* Image
* Author
* Image dimensions
* Picsum ID
* Active/center card styling
* Image link
* Hover image scaling
* Card information

### `index.css`

Contains the Tailwind CSS import and custom 3D utility classes for:

* Perspective
* Y-axis rotation
* Positive rotation
* Negative rotation

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/YOUR-USERNAME/react-3d-gallery-pagination.git
```

Move into the project directory:

```bash
cd react-3d-gallery-pagination
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

---

## 🚀 Usage

Once the development server is running, open the application in your browser.

You can:

1. Browse the dynamically loaded images.
2. Navigate between cards using the left/right controls.
3. Use the mouse wheel to change the active card.
4. Swipe on mobile devices to navigate.
5. Use **Prev Page** and **Next Page** to request different API pages.
6. Click a card to make it the active featured card.
7. Hover over images to see the image zoom interaction.

---

## 🔗 External API

This project uses:

**Picsum Photos**

```text
https://picsum.photos/
```

The application uses the Picsum list endpoint to retrieve image metadata and image URLs.

---

## 📚 What This Project Demonstrates

This project was built around practical frontend concepts including:

* React state management
* React lifecycle with `useEffect`
* DOM interaction with `useRef`
* Axios API requests
* REST API integration
* Dynamic rendering with `.map()`
* Conditional rendering
* Pagination logic
* Touch event handling
* Mouse wheel event handling
* Responsive design
* Tailwind CSS utilities
* CSS 3D transforms
* Dynamic backgrounds
* Loading states
* Component-based architecture
* Lazy image loading

---

## 🎯 Project Focus

The main focus of this project is **frontend development and API integration**.

It demonstrates how external API data can be fetched with Axios, transformed into a UI-friendly structure, stored in React state, and rendered inside an interactive responsive gallery.

---

## 📌 Current Limitations

This project intentionally keeps the implementation focused on the current gallery functionality.

It currently does **not** include:

* User authentication
* Backend/database
* Image uploading
* Search functionality
* Category filtering
* Favorites/bookmarks
* Infinite scrolling
* Image editing
* Admin dashboard

---

## 👨‍💻 Author

**Rafay Amir**

Frontend Developer focused on building interactive and responsive web experiences with modern JavaScript and React.

---

## 📄 License

This project is intended for learning and portfolio purposes.

Images are provided dynamically through the **Picsum Photos API** and are not bundled with this repository.
