serviceApp.service("jqueryDemo", function () {
    var
        getDocumentHeader = function () {
            return "<html><head><style type=\"text/css\" media=\"print\">@page { size: landscape; } .page-break {background-color: white;color: black;font-size: small;font-family: sans-serif, helvetica, tahoma, arial; display: block;page-break-before: always;} table {width: 100%;background-color: #f1f1c1;} table tr:nth-child(even) { background-color: #eee; } table tr:nth-child(odd) { background-color: #fff; } table th { color: white; background-color:black; text-align: left;}</style></head><body style=\"font-family:arial;text-align: center;\">";
        };
    var
        getDocumentHeaderPortrait = function () {
            return "<html><head><style type=\"text/css\" media=\"print\">@page { size: portrait; } .page-break {background-color: white;color: black;font-size: small;font-family: sans-serif, helvetica, tahoma, arial; display: block;page-break-after: always;} table {width: 100%;background-color: #f1f1c1;} table tr:nth-child(even) { background-color: #eee; } table tr:nth-child(odd) { background-color: #fff; } table th { color: white; background-color:black; text-align: left;}</style></head><body style=\"font-family:arial;text-align: center;\">";
        };

    var
        getBootstrapPortrait = function (content) {
            return "<!doctype html>" +
                "<html lang=\"en\">" +
                "<head>" +
                "<meta charset=\"UTF-8\">" +
                "<title>Pick Ticket</title>" +
                "<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css\">" +
                "<style>" +
                " @page { size: portrait; } " +
                " @import url(http://fonts.googleapis.com/css?family=Bree+Serif); " +
                "  body, h1, h2, h3, h4, h5, h6{ " +
                "  font-family: 'Bree Serif', serif; " +
                " }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class=\"container\">" +
                content +
                "</div>" +
                "</body>" +
                "</html>";
        };

    var
        getDocumentFooter = function () {
            return "</body></html>";
        };
    var
        getPrintDocument = function (content) {
            return getDocumentHeader() + content + getDocumentFooter();
        };
    var
        getPrintDocumentPortrait = function (content) {
            return getDocumentHeaderPortrait() + content + getDocumentFooter();
        };
    return {
        getDocumentHeaderPortrait: getDocumentHeaderPortrait,
        getDocumentHeader: getDocumentHeader,
        getDocumentFooter: getDocumentFooter,
        getPrintDocument: getPrintDocument,
        getPrintDocumentPortrait: getPrintDocumentPortrait,
        getBootstrapPortrait: getBootstrapPortrait
    };
});