import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  getGymDetail,
} from "../../data/gymDetails";


const DetailReaderContext =
  createContext(null);


function resolveDetail(
  detailOrId
) {
  if (!detailOrId) {
    return null;
  }


  if (
    typeof detailOrId ===
    "string"
  ) {
    return getGymDetail(
      detailOrId
    );
  }


  if (
    typeof detailOrId ===
      "object" &&
    detailOrId.id
  ) {
    return detailOrId;
  }


  return null;
}


export function DetailReaderProvider({
  children,
}) {
  const [
    stack,
    setStack,
  ] = useState([]);

  const openerRef =
    useRef(null);


  const openDetail =
    useCallback(
      (detailOrId) => {
        const detail =
          resolveDetail(
            detailOrId
          );


        if (!detail) {
          return;
        }


        if (
          document.activeElement
          instanceof HTMLElement
        ) {
          openerRef.current =
            document.activeElement;
        }


        setStack([
          detail,
        ]);
      },
      []
    );


  const pushDetail =
    useCallback(
      (detailOrId) => {
        const detail =
          resolveDetail(
            detailOrId
          );


        if (!detail) {
          return;
        }


        setStack(
          (current) => [
            ...current,
            detail,
          ]
        );
      },
      []
    );


  const closeReader =
    useCallback(() => {
      setStack([]);
    }, []);


  const goBack =
    useCallback(() => {
      setStack(
        (current) => {
          if (
            current.length <= 1
          ) {
            return [];
          }


          return current.slice(
            0,
            -1
          );
        }
      );
    }, []);


  const restoreFocus =
    useCallback(() => {
      const opener =
        openerRef.current;

      openerRef.current =
        null;


      if (!opener) {
        return;
      }


      requestAnimationFrame(
        () => {
          opener.focus?.();
        }
      );
    }, []);


  const current =
    stack.length > 0
      ? stack[
          stack.length - 1
        ]
      : null;


  const currentId =
    current?.id ??
    null;


  const value =
    useMemo(
      () => ({
        stack,

        current,

        currentId,

        isOpen:
          Boolean(
            current
          ),

        canGoBack:
          stack.length > 1,

        openDetail,

        pushDetail,

        closeReader,

        goBack,

        restoreFocus,
      }),
      [
        stack,
        current,
        currentId,
        openDetail,
        pushDetail,
        closeReader,
        goBack,
        restoreFocus,
      ]
    );


  return (
    <DetailReaderContext.Provider
      value={value}
    >
      {children}
    </DetailReaderContext.Provider>
  );
}


export function useDetailReader() {
  const context =
    useContext(
      DetailReaderContext
    );


  if (!context) {
    throw new Error(
      "useDetailReader mora biti korišćen unutar DetailReaderProvider-a."
    );
  }


  return context;
}