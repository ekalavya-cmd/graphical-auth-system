# Graphical Authentication System (GAS)

## Overview
The Graphical Authentication System (GAS) is an innovative web-based application designed to enhance security through a multi-layered authentication process. Unlike traditional text-based passwords, GAS leverages various graphical and interactive methods to authenticate users, including image-based points, color selection, pattern drawing, audio sequences, puzzle arrangement, emoji sequences, and name pairings. This project aims to provide a secure and user-friendly alternative to conventional authentication systems.

## Features
- **Multi-Layered Authentication**: Supports eight unique layers, each with a distinct graphical challenge.
- **Interactive UI**: Utilizes HTML5 Canvas for dynamic interactions like drawing and dragging.
- **Responsive Design**: Optimized for both desktop and mobile devices with a modern, glassmorphism-inspired aesthetic.
- **Backend Support**: Built with Express.js and MongoDB for session management and user data storage.
- **Client-Side Validation**: Real-time feedback and error handling for a seamless user experience.

## Tech Stack
- **Frontend**: HTML, CSS (with Tailwind-inspired custom styles), JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Dependencies**: bcrypt (for password hashing), express-session (for session management)

## Installation
1. **Clone the repository:**

   ```bash
   git clone https://github.com/ekalavya-cmd/graphical-auth-system.git
   ```
3. **Navigate to the project directory:**
   
   ```bash
   cd graphical-auth
   ```
5. **Install the required dependencies:**
   
   ```bash
   cd graphical-auth
   ```
7. Set up MongoDB locally and ensure it is running. Update the connection string in `server.js` (e.g., `mongodb://localhost/auth_system`) if necessary.
9. **Start the server:**
    
   ```bash
   node server.js
   ```
11. Open your web browser and visit `http://localhost:3000` to access the application.

## Usage
1. **Registration:**
- Navigate to the registration page by following the "New to GAS? Register" link on the login page.
- Complete the eight registration layers sequentially:
  - **Layer 1:** Enter email (must end with @gas.com), username, and password.
  - **Layer 2:** Mark at least 3 points on an image.
  - **Layer 3:** Select at least 3 colors from a color wheel.
  - **Layer 4:** Draw a pattern with at least 3 dots.
  - **Layer 5:** Select at least 3 audio clips in sequence.
  - **Layer 6:** Arrange a 3x3 puzzle with numbered pieces.
  - **Layer 7:** Choose at least 3 emojis in sequence.
  - **Layer 8:** Pair 3 left names with 3 right names using drag-and-drop.
- Submit each layer to proceed to the next until registration is complete.
2. **Login:**
- Enter your email or username on the login page and click "Next" to select an authentication layer.
- Complete the chosen layer's challenge (e.g., entering a password, marking points, etc.).
- Successfully passing all required layers redirects you to the homepage.
3. **Logout:**
- Click the "Logout" button on the homepage to end your session and return to the login page.

## Contributing
Contributions are welcome! Please fork the repository and submit pull requests for any enhancements or bug fixes.

## License
This project is licensed under the ISC License.

## Acknowledgments
- Inspired by advanced authentication research and interactive web technologies.
- Thanks to the open-source community for tools like Express.js and Mongoose.

   
 
