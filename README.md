# 🏫 Student Details - Intermediate Results Explorer (TSBIE + IndiaResults)

A data exploration and search tool built with **Next.js** to retrieve student details from publicly available **Intermediate results data** using **TSBIE** and **IndiaResults** post-exploration vulnerability.

## 📌 Overview

This project was inspired by a post-exploration of data flow from **IndiaResults** and **TSBIE** during Intermediate board result publishing. By analyzing the POST data and endpoint responses, a search interface was built to allow querying of student results based on their hall ticket numbers.

> ⚠️ **Disclaimer**: This project is for educational and research purposes only. It highlights the importance of data privacy and secure API design in public examination systems. No data is stored or misused.

---

## 🔧 Tech Stack

- [Next.js](https://nextjs.org/) – React Framework for SSR
- [Tailwind CSS](https://tailwindcss.com/) – Styling
- [Axios](https://axios-http.com/) – API requests
- [Cheerio](https://cheerio.js.org/) – Web scraping & HTML parsing

---

## 🔍 Features

- Search student results by **Name or Hall Ticket Number**
- Real-time fetch from **IndiaResults/TSBIE** servers
- Displays student name, photo and total marks
- Simple UI with responsive design
- Client-side + Server-side rendered (SSR)

---

## 🚨 Vulnerability Highlight

The project is built upon a discovery that the result portal accepts **POST requests** with specific parameters and returns **HTML with student details**, making it prone to scraping.

