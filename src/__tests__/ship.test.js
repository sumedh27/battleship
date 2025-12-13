import { describe, beforeEach, test, expect, jest } from '@jest/globals';
import Ship from '../factories/ship';

describe('ship tests', () => {
    let ship, spy;

    beforeEach(() => {
        ship = Ship(5);
        spy = jest.spyOn(ship, 'hit');
    });

    test('size , total health, and initial health of ship to be the same', () => {
        expect(ship.size).toEqual(5);
        expect(ship.totalHP).toEqual(5);
        expect(ship.getHealth()).toEqual(5);
    });

    test('ship takes correct damage', () => {
        ship.hit();
        ship.hit();

        expect(ship.size).toEqual(5);
        expect(ship.totalHP).toEqual(5);
        expect(ship.getHealth()).toEqual(3);
    });

    test('sink the ship if health is 0', () => {
        //Hit the ship 5 times

        for (let i = 0; i < 5; i++) {
            ship.hit();
        }

        expect(spy).toHaveBeenCalledTimes(5);

        expect(ship.size).toEqual(5);
        expect(ship.totalHP).toEqual(5);
        expect(ship.getHealth()).toEqual(0);

        expect(ship.isSunk()).toBeTruthy();
    });

    test('do not take more damage on health 0', () => {
        //Hit the ship 10 times

        for (let i = 0; i < 10; i++) {
            ship.hit();
        }

        expect(spy).toHaveBeenCalledTimes(10);

        expect(ship.size).toEqual(5);
        expect(ship.totalHP).toEqual(5);
        expect(ship.getHealth()).toEqual(0);

        expect(ship.isSunk()).toBeTruthy();
    });

    test('set  ship coords', () => {
        ship.setCoords([1, 4], 'horizontal');
        expect(ship.getCoords().axis).toEqual('horizontal');

        expect(ship.getCoords().coords).toEqual([1, 4]);
    });
});
