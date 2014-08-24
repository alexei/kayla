(function(window) {
    var kayla = {}

    kayla.wpm = 270

    kayla.category = "Time"

    /**
     * timing functions
     */
    kayla.trackText = function kayla_track_text(node, label) {
        var words_count = 0,
            time_to = 0,
            goals = {}
        kayla.util.walk(node, function(node) {
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

    kayla.trackAudio = function kayla_track_audio(node, label) {
        kayla._trackMedia(node, "audio", "listen", label)
    }

    kayla.trackVideo = function kayla_track_video(node, label) {
        kayla._trackMedia(node, "video", "watch", label)
    }

    kayla._trackMedia = function kayla_track_media(node, tag, variable, label) {
        if (node.nodeName.toLowerCase() === tag) {
            var time_to = 0,
                goals = {}
            node.addEventListener("loadedmetadata", function() {
                time_to = node.duration * 1000
                goals = kayla.util.goals(time_to)
            })
            node.addEventListener("timeupdate", function() {
                Object.keys(goals).map(function(goal) {
                    if (node.currentTime * 1000 >= goals[goal]) {
                        delete goals[goal]
                        kayla.util.notify(kayla.category, variable, goal, label)
                    }
                })
            })
        }
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
