import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Task Manager
          </h1>
            List of tasks <br/>
            . T1  T1 Desc  Edit/ Delete <br/>
            . T2  T3 Desc  Edit/ Delete <br/>
            Add Task <br/>
        </div>
      </main>
    </div>
  );
}
