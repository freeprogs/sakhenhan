/*
 * This file is a part of __PROGRAM_NAME__ __PROGRAM_VERSION__
 *
 * __PROGRAM_COPYRIGHT__ __PROGRAM_AUTHOR__ __PROGRAM_AUTHOR_EMAIL__
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

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
        var postTables = Array.from(allTables).filter((i) => {
            var cond1 = /^t_rep_a_id/.test(i.id);
            var cond2 = !i.querySelector("span.gr");
            return cond1 && cond2;
        });
        var wrappedPosts = Array.from(postTables).map((i) => {
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
