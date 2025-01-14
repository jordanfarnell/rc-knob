const DIRECTIONS = {
    37: -1,
    38: 1,
    39: 1,
    40: -1
};

export const onMouseMoveStart = (dispatch) => (e) =>
    dispatch({ ...e, type: "START" });

export const onKeyDown = (dispatch) => (e) => {
    const direction = DIRECTIONS[e.keyCode];
    if (!direction) {
        return;
    } else {
        e.preventDefault();
        dispatch({
            type: "STEPS",
            direction
        });
    }
};
export const onScroll = (dispatch) => (e) => {
    const direction =
        e.deltaX < 0 || e.deltaY > 0
            ? 1
            : e.deltaX > 0 || e.deltaY < 0
            ? -1
            : 0;

    e.preventDefault();
    dispatch({
        type: "STEPS",
        direction
    });
};

const addEventToBody = (name, fn) => document.body.addEventListener(name, fn);
const addNonPassiveEventToBody = (name, fn) =>
    document.body.addEventListener(name, fn, { passive: false });
const removeEventFromBody = (name, fn) =>
    document.body.removeEventListener(name, fn);
const removeNonPassiveEventFromBody = (name, fn) =>
    document.body.removeEventListener(name, fn, { passive: false });

export const handleEventListener =
    ({ dispatch, isActive }) =>
    () => {
        const onMove = ({ pageX, pageY }) =>
            dispatch({ pageX, pageY, type: "MOVE" });
        const onStop = () => dispatch({ type: "STOP" });
        const onTouchStart = (e) => {
            e.preventDefault();
            dispatch({
                type: "MOVE",
                pageX: e.changedTouches[0].pageX,
                pageY: e.changedTouches[0].pageY
            });
        };
        if (isActive) {
            addEventToBody("mousemove", onMove);
            addEventToBody("mouseup", onStop);
            addNonPassiveEventToBody("touchmove", onTouchStart);
            addEventToBody("touchend", onStop);
            return () => {
                removeEventFromBody("mousemove", onMove);
                removeEventFromBody("mouseup", onStop);
                removeNonPassiveEventFromBody("touchmove", onTouchStart);
                removeEventFromBody("touchend", onStop);
            };
        }
    };
