(ns ajax-repl
  (:use compojure))

(defn show-repl
  "Function to create HTML boilerplate."
  []
  (html
    [:html
      [:head
        [:title "Clojure REPL"]]
      [:body
        [:div#terminal]]]))

(defn eval-repl-cmd
  "Evaluate a command and return the result."
  [cmd]
  "TODO")

(defservlet repl-servlet
  (GET "/"
    (show-repl))
  (POST "/repl"
    (eval-repl-cmd (params :cmd)))
  (GET "/*"
    (or (serve-file (route :*))
        :next))
  (ANY "*"
    (page-not-found)))

(run-server {:port 8080}
  "/*" repl-servlet)
