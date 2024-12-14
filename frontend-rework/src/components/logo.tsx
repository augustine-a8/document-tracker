export function Logo() {
  return (
    <div className="flex flex-row items-center gap-4">
      <div className="border border-gray-200 rounded-lg grid place-items-center h-8 aspect-square">
        <i className="ri-file-paper-2-fill text-gray-400"></i>
      </div>
      <div className="relative">
        <p>
          <span className="font-semibold">Doc</span>hub
        </p>
        <p className="text-[8px] absolute top-0 -right-4 font-semibold">TM</p>
      </div>
    </div>
  );
}
