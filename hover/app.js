document.body.addEventListener("mousemove", evt => {
  const mouseX = evt.clientX;
  const mouseY = evt.clientY;

  gsap.set(".cursor-home", {
    x: mouseX,
    y: mouseY });


  gsap.to(".shapeh", {
    x: mouseX,
    y: mouseY,
    stagger: -0.1 });

});