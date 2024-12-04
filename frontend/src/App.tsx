import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Card,
} from "@/components/ui/card";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

const selectedCells: { [id: number] : string } = {};
export function App() {
    
    enum gameState {
        PLAYING,
        WIN,
        LOOSE,
        DRAW
    }

    const [symbol, setSymbol] = useState("X");

    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    const checkWinningCombination = () => {
        
        const xKeys: number[] = Object.keys(selectedCells)
            .filter(key => selectedCells[Number(key)] === symbol)
            .map(key => Number(key));

        let check: number[] | undefined = winningCombinations.find(combination => {
            return combination.every(elementOfCombination => xKeys.includes(elementOfCombination));
        });

        if (check !== undefined)
            return gameState.WIN;

        if (Object.keys(selectedCells).length >= 9)
            return gameState.DRAW;

        return gameState.PLAYING;
    }

    const handleCellClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.currentTarget.innerText = symbol;
        selectedCells[Number(event.currentTarget.id)] = symbol;
        
        console.log(selectedCells);

        let status = checkWinningCombination();
        if (status === gameState.WIN || status === gameState.DRAW) {
            console.log("There is a winner");
            document.getElementById("winner-dialog")?.click();
        }

        symbol === "X" ? setSymbol("O") : setSymbol("X")
    }
    
    const x = () => {
        const cells = [];
        for (let i = 0; i < 9; i++) {
            cells.push(<div className="cell" id={`${i}`} onClick={handleCellClick}></div>);
        }
        return cells;
    }

    return (
        <div className="flex flex-row min-h-screen justify-center items-center">
            <Card className="p-5">
                <div className="board">
                    {
                        x()
                    }
                </div>
            </Card>

            <Dialog>
                <DialogTrigger asChild style={{ display: "none" }}>
                    <Button variant="outline" id="winner-dialog" style={{ display: "none" }}>
                        Edit Profile
                    </Button>
                </DialogTrigger>

                <DialogContent
                    className="sm:max-w-[425px] flex flex-col items-center justify-center text-center"
                    onInteractOutside={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                >
                    <DialogHeader>
                        <DialogTitle>Game Over!</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <p>The player using 'X' has won!</p>
                    <DialogFooter className="flex justify-center mt-4">
                        <div className="grid grid-cols-2 gap-12">
                            <Button>Home</Button>
                            <Button onClick={() => window.location.reload()}>
                                Rematch
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );

}