Convert touch events into mouse events
======================================

About
-----

This provides convertion touch events into mouse events
The target is a event of mousedown, mousemove and mouseup.

Usage
-----

::

  $(document).mousedown(function (evt) {
    print(
      evt.type, //< mousedown
      evt.originalEvent.type // touchstart if touch terminal
    );
  }).mousemove(function (evt) {
    print(
      evt.type, //< mousemove
      evt.originalEvent.type // touchmove if touch terminal
    );
  }).mouseup(function (evt) {
    print(
      evt.type, //< mouseup
      evt.originalEvent.type // touchend if touch terminal
      evt.pageX //< emulate pageX
    );
  });
