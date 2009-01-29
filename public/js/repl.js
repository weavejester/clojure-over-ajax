// Start Clojure REPL when document has loaded

$(function() {
    new MouseApp.Repl("#repl", {
        columns: 80,
        rows: 40,
        replUrl: "/repl",
        ps: "=>",
        greeting: "Clojure"
    });
});
