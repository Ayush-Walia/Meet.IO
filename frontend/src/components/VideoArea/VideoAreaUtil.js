/* 
    Video conference layout logic shamelessly copied from https://github.com/Alicunde/Videoconference-Dish-CSS-JS.
    Its bruteforcing the best way to fit rectangles in given area.
*/
function Area(Increment, Count, Width, Height, Margin = 10) {
    let i = 0; let w = 0;
    let h = Increment * 0.75 + (Margin * 2);
    while (i < (Count)) {
        if ((w + Increment) > Width) {
            w = 0;
            h = h + (Increment * 0.75) + (Margin * 2);
        }
        w = w + Increment + (Margin * 2);
        i++;
    }
    if (h > Height) return false;
    else return Increment;
}

export default function streamsLayoutHandler(videoAreaRef, streamCount, setStreamArea) {
    let Margin = 2;
    let Scenary = videoAreaRef.current;
    let Width = Scenary.offsetWidth - (Margin * 2);
    let Height = Scenary.offsetHeight - (Margin * 2);
    let max = 0;

    let i = 1;
    while (i < 5000) {
        let w = Area(i, streamCount, Width, Height, Margin);
        if (w === false) {
            max = i - 1;
            break;
        }
        i++;
    }

    max = max - (Margin * 2);
    setStreamArea({ width: max + "px", margin: Margin + "px", height: (max * 0.75) + "px" })
}