(ns ajax-repl
  (:use compojure))

(def repl-scripts
  (include-js "/js/jquery.js"
              "/js/mouseapp_2.js"
              "/js/mouserepl_2.js"
              "/js/repl.js"))

(def credits
  [:p "Based on code from _why's "
    [:q (link-to "http://tryruby.hobix.com/" "Try Ruby!")]])

(defn show-repl
  "HTML for the REPL index page"
  []
  (html
    [:html
      [:head
        [:title "Clojure REPL"]
        repl-scripts]
      [:body
        [:div#terminal
          [:div#repl]]
        credits]]))

(defn eval-repl-cmd
  "Evaluate a command and return the result."
  [cmd]
  (str "Run command: " cmd))

(defservlet repl-servlet
  (GET "/"
    (show-repl))
  (GET "/repl"
    (eval-repl-cmd (params :cmd)))
  (GET "/*"
    (or (serve-file (route :*))
        :next))
  (ANY "*"
    (page-not-found)))

(run-server {:port 8080}
  "/*" repl-servlet)
