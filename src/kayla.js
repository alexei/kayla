(function(window) {
    var kayla = {}

    kayla.wpm = 270

    kayla.category = "Time"

    /**
     * timing functions
     */
    kayla.trackText = function kayla_track_text(tree, label) {
        var words_count = 0,
            time_to = 0,
            goals = {}
        kayla.util.walk(tree, function(node) {
            if (node.nodeType === 3 && node.nodeValue) {
                words_count += node.nodeValue.trim().split(/\s+/g).length
            }
        })
        time_to = (words_count / kayla.wpm) * 60 * 1000
        goals = kayla.util.goals(time_to)
        Object.keys(goals).map(function(goal) {
            setTimeout(
                function() {
                    kayla.util.notify(kayla.category, "read", goal, label)
                },
                goals[goal]
            )
        })
    }

    kayla.trackAudio = function kayla_track_audio(tree, label) {
        var time_to = 0,
            goals = {}
        kayla.util.walk(tree, function(node) {
            if (node.nodeName.toLowerCase() === "audio") {
                node.addEventListener("loadedmetadata", function() {
                    time_to = node.duration * 1000
                    goals = kayla.util.goals(time_to)
                    Object.keys(goals).map(function(goal) {
                        setTimeout(
                            function() {
                                kayla.util.notify(kayla.category, "listen", goal, label)
                            },
                            goals[goal]
                        )
                    })
                })
            }
        })
    }

    kayla.trackVideo = function kayla_track_video(tree, label) {
        var time_to = 0,
            goals = {}
        kayla.util.walk(tree, function(node) {
            if (node.nodeName.toLowerCase() === "video") {
                node.addEventListener("loadedmetadata", function() {
                    time_to = node.duration * 1000
                    goals = kayla.util.goals(time_to)
                    Object.keys(goals).map(function(goal) {
                        setTimeout(
                            function() {
                                kayla.util.notify(kayla.category, "watch", goal, label)
                            },
                            goals[goal]
                        )
                    })
                })
            }
        })
    }

    /**
     * helper functions
     */
    kayla.util = {}

    kayla.util.goals = function kayla_util_goals(time_to) {
        return {
            "0%": 0,
            "25%": parseInt(time_to * 0.25, 10),
            "50%": parseInt(time_to * 0.50, 10),
            "75%": parseInt(time_to * 0.75, 10),
            "100%": parseInt(time_to)
        }
    }

    kayla.util.queue = function kayla_util_queue(funcs) {
        (function next() {
            funcs.length && funcs.shift()(next)
        })()
    }

    kayla.util.walk = function kayla_util_walk(tree, fn) {
        for (fn(tree), tree = tree.firstChild; tree; tree = tree.nextSibling) {
            kayla.util.walk(tree, fn)
        }
    }

    kayla.util.notify = function kayla_util_notify(category, variable, time, label) {
        if (typeof ga === "function") {
            ga("send", "timing", category, variable, time, label)
        }
        if (typeof _gaq !== "undefined" && typeof _gaq.push === "function") {
            _gaq.push(["_trackTiming", category, variable, time, label, 100])
        }
    }

    window.kayla = kayla
})(window);
