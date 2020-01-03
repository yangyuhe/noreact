export function Diff<T>(
    oldset: T[],
    newset: T[],
    compare: (left: T, right: T) => boolean
) {
    let o2n = {};
    let n2o = {};
    let square: SquareUnit[][] = initSquare(oldset, newset);
    findShortest<T>(square, oldset, newset, compare, o2n, n2o);
    let opers = getOpers(square, oldset, newset, o2n, n2o);
    opers.reverse();
    return opers;
}

function findShortest<T>(
    square: SquareUnit[][],
    oldset: T[],
    newset: T[],
    compare: (left: T, right: T) => boolean,
    o2n,
    n2o
): number {
    let target = square[oldset.length][newset.length];
    if (target.value != -1) return target.value;

    let lastnum = 0;
    let same = compare(oldset[oldset.length - 1], newset[newset.length - 1]);
    if (same) {
        lastnum = 0;
        o2n[oldset.length - 1] = newset.length - 1;
        n2o[newset.length - 1] = oldset.length - 1;
    }
    else lastnum = 1;
    let p1 =
        findShortest(
            square,
            oldset.slice(0, oldset.length - 1),
            newset,
            compare,
            o2n,
            n2o
        ) + 1;
    let p2 =
        findShortest(
            square,
            oldset,
            newset.slice(0, newset.length - 1),
            compare,
            o2n,
            n2o
        ) + 1;
    let p3 =
        findShortest(
            square,
            oldset.slice(0, oldset.length - 1),
            newset.slice(0, newset.length - 1),
            compare,
            o2n,
            n2o
        ) + lastnum;

    let min = Math.min(p1, p2, p3);
    target.value = min;

    if (min == p1) {
        target.fromRow = oldset.length - 1;
        target.fromColumn = newset.length;
    } else {
        if (min == p2) {
            target.fromRow = oldset.length;
            target.fromColumn = newset.length - 1;
        } else {
            target.fromRow = oldset.length - 1;
            target.fromColumn = newset.length - 1;
        }
    }

    return target.value;
}
function initSquare<T>(oldset: T[], newset: T[]) {
    let square: SquareUnit[][] = [];
    for (let i = 0; i <= oldset.length; i++) {
        let row = [];
        for (let j = 0; j <= newset.length; j++) {
            if (i == 0) {
                row.push({ value: j, fromRow: 0, fromColumn: j - 1 });
                continue;
            }
            if (j == 0) {
                row.push({ value: i, fromRow: i - 1, fromColumn: 0 });
                continue;
            }
            row.push({ value: -1, fromRow: -1, fromColumn: -1 });
        }
        square.push(row);
    }
    return square;
}

interface SquareUnit {
    value: number;
    fromRow: number;
    fromColumn: number;
}
interface NextState<T> {
    oldValue?: T;
    isdeprecated?: boolean,
    /**当state为old类型时newValue表示新值 */
    newValue?: T;
    newValueOrigin?: T;
    state: 'new' | 'delete' | 'old' | 'replace';
}

function getOpers<T>(
    square: SquareUnit[][],
    oldset: T[],
    newset: T[],
    o2n,
    n2o
): NextState<T>[] {
    let column = newset.length;
    let row = oldset.length;

    let states: NextState<T>[] = [];
    while (true) {
        if (row == 0 && column == 0) {
            break;
        }
        let unit = square[row][column];
        if (unit.fromColumn == column - 1 && unit.fromRow == row - 1) {
            if (unit.value != square[row - 1][column - 1].value) {
                states.push({
                    oldValue: oldset[row - 1],
                    isdeprecated: o2n[row - 1] == null,
                    state: 'replace',
                    newValue: newset[column - 1],
                    newValueOrigin: oldset[n2o[column - 1]]
                });
            } else {
                states.push({
                    oldValue: oldset[row - 1],
                    state: 'old',
                    newValue: newset[column - 1]
                });
            }
            row--;
            column--;
            continue;
        }
        if (unit.fromColumn == column && unit.fromRow == row - 1) {
            states.push({ oldValue: oldset[row - 1], state: 'delete', isdeprecated: o2n[row - 1] == null });
            row--;
            continue;
        }
        if (unit.fromColumn == column - 1 && unit.fromRow == row) {
            states.push({ newValue: newset[column - 1], state: 'new', newValueOrigin: oldset[n2o[column - 1]] });
            column--;
            continue;
        }
    }
    return states;
}
