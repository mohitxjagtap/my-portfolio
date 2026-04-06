<!DOCTYPE html>
<html>
<head>
<title>Mohit Jagtap Portfolio</title>
<style>
body {
    font-family: Arial;
    margin: 0;
    background: #f4f4f4;
}
header {
    background: #333;
    color: white;
    text-align: center;
    padding: 20px;
}
section {
    padding: 20px;
    margin: 10px;
    background: white;
    border-radius: 10px;
}
img {
    border-radius: 10px;
    margin: 10px;
}
button {
    padding: 10px;
    margin: 10px;
}
.dark {
    background: #121212;
    color: white;
}
</style>
</head>

<body>

<header>
<h1>Mohit Jagtap</h1>
<button onclick="toggleDark()">Toggle Dark Mode</button>
</header>

<section>
<h2>About Me</h2>
<p>B.Tech CSE student at MIT VPU</p>
</section>

<section>
<h2>Projects</h2>
<p>Driver Drowsiness Tracking System</p>
</section>

<section>
<h2>Contact</h2>
<p>Email: mohitdatta1980</p>
<p>Phone: 8668956538</p>
</section>

<script>
function toggleDark() {
    document.body.classList.toggle("dark");
}
</script>

</body>
</html>
