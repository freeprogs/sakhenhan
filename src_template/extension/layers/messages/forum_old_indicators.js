
"use strict";

(function () {

    document.forumOldIndicatorsOptions = {};

    function PostFacade(node) {
        this.node = node;
    }

    PostFacade.prototype.sortIndicators = function () {
        if (this.node.isProcessed_sortIndicators) {
            return true;
        }
        var pointNode = this.node.querySelector(".point");
        var botmarkNode = this.node.querySelector(".botmark");
        var authormarkNode = this.node.querySelector(".authormark");
        var usersmarkNode = this.node.querySelector(".usersmark");

        if (pointNode) {
            this.node.isProcessed_sortIndicators = true;
        }
        if (pointNode && botmarkNode) {
            pointNode.parentElement.insertBefore(pointNode, botmarkNode);
        }
        if (pointNode && authormarkNode) {
            pointNode.parentElement.insertBefore(pointNode, authormarkNode);
        }
        if (pointNode && usersmarkNode) {
            pointNode.parentElement.insertBefore(pointNode, usersmarkNode);
        }
        return true;
    }

    function processPosts() {
        var allTables = document.getElementsByTagName("table");
        var postTables = Array.filter(allTables, (i) => {
            var cond1 = /^t_rep_a_id/.test(i.id);
            var cond2 = !i.querySelector("span.gr");
            return cond1 && cond2;
        });
        var wrappedPosts = Array.map(postTables, (i) => {
            return new PostFacade(i);
        });

        wrappedPosts.forEach((i) => {
            i.sortIndicators();
        });
    }

    setInterval(() => {
        processPosts();
    }, 100);

})();
