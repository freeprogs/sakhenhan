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

describe("Suite", function() {

    describe("Test x * 2", function() {

        var func = testscript_object.f2;

        it("Returns 4 for 2", function() {
            var i = 2;
            var o = 4;
            assert.equal(func(i), o);
        });

        it("Returns 8 for 4", function() {
            var i = 4;
            var o = 8;
            assert.equal(func(i), o);
        });

    });

    describe("Test x * 3", function() {

        var func = testscript_object.f3;

        it("Returns 6 for 2", function() {
            var i = 2;
            var o = 6;
            assert.equal(func(i), o);
        });

        it("Returns 12 for 4", function() {
            var i = 4;
            var o = 12;
            assert.equal(func(i), o);
        });

    });

});
