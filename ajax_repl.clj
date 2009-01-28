(ns ajax-repl
  (:use compojure))

(def repl-scripts
  (include-js "/js/jquery.js"
              "/js/mouseapp_2.js"
              "/js/mouserepl_2.js"
              "/js/repl.js"))

(def try-ruby
  (link-to "http://tryruby.hobix.com/" "Try Ruby!"))

(def credits
  [:p "With javascript based on _why's: " try-ruby])

(defn show-repl
  "HTML for the REPL index page"
  []
  (html
    [:html
      [:head
        [:title "Clojure REPL"]
        (include-css "css/site.css")
        repl-scripts]
      [:body
        [:div#terminal
          [:div#repl]]
        credits]]))

(defn eval-repl-cmd
  "Evaluate a command and return the result."
  [cmd]
  (with-out-str
    (println
      "=>" (eval (read-string cmd)))))

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
