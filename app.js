const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const links = document.querySelectorAll(".nav-links li");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open-ham");
  links.forEach(link => {
    link.classList.toggle("fade-ham");
  });
});


function myFunction(x) {
  x.classList.toggle("change-h");
}


(function ($) {
  "use strict";

  //Page cursors

  document.getElementsByTagName("nav")[0].addEventListener("mousemove", function (n) {
    t.style.left = n.clientX + "px",
      t.style.top = n.clientY + "px",
      e.style.left = n.clientX + "px",
      e.style.top = n.clientY + "px",
      i.style.left = n.clientX + "px",
      i.style.top = n.clientY + "px"
  });
  var t = document.getElementById("cursor"),
    e = document.getElementById("cursor2"),
    i = document.getElementById("cursor3");

  function n(t) {
    e.classList.add("hover"), i.classList.add("hover")
  }

  function s(t) {
    e.classList.remove("hover"), i.classList.remove("hover")
  }
  s();
  for (var r = document.querySelectorAll(".hover-target"), a = r.length - 1; a >= 0; a--) {
    o(r[a])
  }

  function o(t) {
    t.addEventListener("mouseover", n), t.addEventListener("mouseout", s)
  }

})(jQuery);

let elementsCC = document.querySelectorAll('.origin-center');

elementsCC.forEach(element => {
  let bbox = element.getBBox(),
    x = bbox.x,
    y = bbox.y,
    w = bbox.width,
    h = bbox.height;

  //center center
  let resultCC = (x + (w / 2)) + 'px ' + (y + (h / 2)) + 'px';

  element.style.setProperty("transform-origin", resultCC)
}); // forEach


let elementsTL = document.querySelectorAll('.origin-left');

elementsTL.forEach(element => {
  let bbox = element.getBBox(),
    x = bbox.x,
    y = bbox.y,
    w = bbox.width,
    h = bbox.height;

  //top left
  let resultTL = x + 'px ' + y + 'px';

  element.style.setProperty("transform-origin", resultTL)
});

$(function () {
  $('.owl-carousel.testimonial-carousel').owlCarousel({
    nav: true,
    navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
    dots: false,
    responsive: {
      0: {
        items: 1,
      },
      750: {
        items: 2,
      }
    }
  });
});

const tl = gsap.timeline();

tl.from(".line-reveal", 0.9, {
  x: 500,
  ease: "power4.out",
  delay: 0.5,
  skewY: 0,
  stagger: {
    amount: 0.3
  }
})

let glowInTexts = document.querySelectorAll(".glowIn");
glowInTexts.forEach(glowInText => {
  let letters = glowInText.textContent.split("");
  glowInText.textContent = "";
  letters.forEach((letter, i) => {
    let span = document.createElement("span");
    span.textContent = letter;
    span.style.animationDelay = `${i * 0.02}s`;
    glowInText.append(span);
  });
});