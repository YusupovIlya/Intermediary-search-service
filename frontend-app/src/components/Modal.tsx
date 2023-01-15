

interface ModalProps {
    active: boolean,
    setActive: (option: any) => void
    content: any
}


export function Modal({active, setActive, content}: ModalProps) {

    return(
        <div className={active 
            ? "bg-slate-100/50 fixed flex items-center justify-center  top-0 left-0 opacity-100 pointer-events-auto w-full h-full overflow-y-scroll"
            : "bg-slate-100/50 fixed flex items-center justify-center opacity-0 pointer-events-none transition top-0 left-0 w-full h-full overflow-y-scroll"}
            onClick={() => setActive(false)}
            >
            <div className={active 
                ? "p-1 rounded-lg bg-white scale-100 transition-all w-4/6 border-slate-400 border-2"
                : "p-1 rounded-lg bg-white scale-50 transition-all w-4/6 border-slate-400 border-2"}
                onClick={e => e.stopPropagation()}
                >
                {content}
            </div>
        </div>
    )
}


//modal = "bg-slate-100 fixed flex items-center justify-center opacity-0 pointer-events-none transition top-0 left-0"
//modal.active = "bg-slate-100 fixed flex items-center justify-center transition top-0 left-0 opacity-100 pointer-events-auto"
//modal_content = "p-5 rounded-lg bg-white scale-50 transition-all w-1/2"
//modal_content.active = "p-5 rounded-lg bg-white scale-100 transition-all w-1/2"