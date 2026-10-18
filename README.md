# Hrishikesh Joshi — Engineering Portfolio & Interactive Canvas Engine

![React 19](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.4-black?style=flat-square&logo=framer)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)

An interactive, performance-focused personal engineering portfolio showcasing production and research projects across Space Situational Awareness (SSA), quantitative finance, and applied machine learning.

---

## Technical Highlights

- **Custom HTML5 Canvas Engine:** Multi-layer parallax starfield with variable particle density, smooth scroll velocity curves, and hardware-accelerated canvas rendering.
- **Physics Engine:** Real-time rigid-body particle simulation with custom gravity triggers.
- **Modern React Architecture:** Built with React 19 and Framer Motion for scroll-linked typography and smooth section transitions.
- **Production Tooling:** Bundled with Vite 8 and ESLint 10.

---

## Featured Projects Showcased

1. **[OURE (Orbital Uncertainty & Risk Engine)](https://github.com/h-rishi16/OURE):** High-performance Space Situational Awareness platform computing orbital collision probabilities ($P_c$) via SGP4 propagation and Foster's algorithm. Published on PyPI (`pip install oure`) with an interactive [3D WebGL Demo](https://oure-pi.vercel.app).
2. **[Sentinel Risk Intelligence](https://github.com/h-rishi16/sentinel):** Unified quantitative risk surveillance terminal integrating GARCH(1,1) volatility surfaces, Monte Carlo Value at Risk (VaR), and real-time fraud detection with FastAPI and HTMX. [Live Demo](https://sentinel-risk-platform.onrender.com/).
3. **[Quantitative Risk Platform](https://github.com/h-rishi16/Quantitative-Risk-Platform):** Advanced portfolio risk modeling platform with Monte Carlo VaR simulations, interactive dashboards, and FastAPI backend.
4. **[Credit Card Fraud Prediction](https://github.com/h-rishi16/Credit-Card-Fraud-Prediction):** Gradient boosted fraud detection system with SHAP-based model interpretability.
5. **[Loan Default Prediction](https://github.com/h-rishi16/Loan-Default-Prediction):** Credit risk scoring and Probability of Default (PD) modeling on LendingClub data.

---

## Architecture & Tech Stack

- **Framework:** React 19
- **Bundler / Dev Server:** Vite 8
- **Animation:** Framer Motion
- **Physics / Visuals:** Matter.js, HTML5 Canvas 2D Context
- **Icons:** Lucide React
- **Styling:** CSS Variables, Responsive Layouts, Dark Palette

---

## Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/h-rishi16/hrishi-portfolio.git
   cd hrishi-portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start local development server:**
   ```bash
   npm run dev
   ```

4. **Production Build:**
   ```bash
   npm run build
   ```

---

## Author

**Hrishikesh Joshi**  
- GitHub: [@h-rishi16](https://github.com/h-rishi16)  
- LinkedIn: [linkedin.com/in/hrishikesh-joshi-93607b23a](https://www.linkedin.com/in/hrishikesh-joshi-93607b23a)  
- Email: hrishirjoshi16324@gmail.com  

---

## License

This project is licensed under the [MIT License](LICENSE).
