require('./util');

describe('eval', function() {
    beforeEach(function() {
        reset();
    });

    describe('built-ins', function() {
        describe('len', function() {
            expect('{{ len(foo) }}', '3');
        });

        describe('upper', function() {
            expect('{{ upper(foo) }}', 'FOO');
            expect('{{ upper(bar) }}', 'BAR');
            expect('{{ len(upper(bar)) }}', '3');
        });

        describe('lower', function() {
            expect('{{ lower(foo) }}', 'foo');
            expect('{{ lower(bar) }}', 'bar');
            expect('{{ len(lower(bar)) }}', '3');
        });

        describe('range', function() {
            expect('{{ range(ten) }}', '0,1,2,3,4,5,6,7,8,9');
            expect('{{ range(4) }}', '0,1,2,3');
            expect('{{ len(range(4)) }}', '4');
            expect('{{ range(len(foo)) }}', '0,1,2');
        });

        describe('join', function() {
            expect('{{ join(range(3), " ") }}', '0 1 2');
            expect('{{ join(range(3), ", ") }}', '0, 1, 2');
            expect('{{ join(range(3), "") }}', '012');

            expect('{{ join(range(3)) }}', '', function() { opt('throwsOnErrors', false) });
            expectException('{{ join(range(3)) }}', function() { opt('throwsOnErrors', true) });
        });

        describe('reverse', function() {
            expect('{{ reverse(range(3)) }}', '2,1,0');
            expect('{{ reverse("foo") }}', 'oof');
            expect('{{ reverse(foo) }}', 'oof');

            expect('{{ reverse() }}', '', function() { opt('throwsOnErrors', false) });
            expectException('{{ reverse() }}', function() { opt('throwsOnErrors', true) });

            expect('{{ reverse(ten) }}', '', function() { opt('throwsOnErrors', false) });
            expectException('{{ reverse(ten) }}', function() { opt('throwsOnErrors', true) });

            expect('{{ reverse(foo) + foo }}', 'ooffoo');
        });

        describe('sort', function() {
            expect('{{ sort(range(3)) }}', '0,1,2');
            expect('{{ sort(arr) }}', '0,1,2,3,4');
            expect('{{ sort(rarr) }}', '2,3,4,8,9');
            expect('{{ sort(hello) }}', ' ,HWdellloor');

            expect('{{ sort(range(3), true) }}', '2,1,0');
            expect('{{ sort(arr, true) }}', '4,3,2,1,0');
            expect('{{ sort(rarr, true) }}', '9,8,4,3,2');
            expect('{{ sort(hello, true) }}', 'roollledWH, ');

            expect('{{ sort() }}', '', function() { opt('throwsOnErrors', false) });
            expectException('{{ sort() }}', function() { opt('throwsOnErrors', true) });

            expect('{{ sort(ten) }}', '', function() { opt('throwsOnErrors', false) });
            expectException('{{ sort(ten) }}', function() { opt('throwsOnErrors', true) });

            expect('{{ sort(hello) + hello }}', ' ,HWdellloorHello, World');
            expect('{{ sort(hello,true) + hello }}', 'roollledWH, Hello, World');
        });

        describe('slice', function() {
            expect('{{ slice(arr,1,4) }}', '1,2,3');
            expect('{{ slice(arr,1,-2) }}', '1,2');
            expect('{{ slice(arr,1) }}', '1,2,3,4');
            expect('{{ slice(arr) }}', '0,1,2,3,4');

            expect('{{ slice("01234",1,4) }}', '123');
            expect('{{ slice("01234",1,-2) }}', '12');
            expect('{{ slice("01234",1) }}', '1234');
            expect('{{ slice("01234") }}', '01234');

            expect('{{ slice(5) }}', '', function() { opt('throwsOnErrors', false); });
            expectException('{{ slice(5) }}', function() { opt('throwsOnErrors', true); });

            expect('{{ slice() }}', '', function() { opt('throwsOnErrors', false); });
            expectException('{{ slice() }}', function() { opt('throwsOnErrors', true); });
        });

        describe('isArray', function() {
            expect('{{ isArray(arr) }}', 'true');
            expect('{{ isArray(foo) }}', 'false');
            expect('{{ isArray(a) }}', 'false');
            expect('{{ isArray("foo") }}', 'false');
            expect('{{ isArray(5) }}', 'false');
        });

        describe('isObject', function() {
            expect('{{ isObject(arr) }}', 'true');
            expect('{{ isObject(foo) }}', 'false');
            expect('{{ isObject(a) }}', 'true');
            expect('{{ isObject("foo") }}', 'false');
            expect('{{ isObject(5) }}', 'false');
        });

        describe('more edge cases', function() {
            expect('{{ len((foo)) }}', '3');
        });
    });
});
