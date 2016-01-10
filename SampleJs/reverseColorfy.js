jQuery.fn.extend({
    reverseColorfy: function (color1, color2) {
        var text = $(this).text();
        var sibling = $(this).next().empty().css({ "color": color1 });
        for (var i = 0; i < text.length; i++) {
            if (i % 2 === 0) 
                sibling.prepend($("<span>" + text[i] + "</span>").css({ "color": color2 }));
            else
                sibling.prepend(text[i]);
        }
    }
});