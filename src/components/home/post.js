export default function ScheduledPost({
  title,
  time,
  children,
  onEditClick,
  onSubmitClick,
}) {
  return (
    <div className="bg-gray-700 p-4 rounded-lg shadow-lg m-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p>Posting at {time}</p>
      <div className="flex justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={onEditClick}
        >
          Edit Time
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={onSubmitClick}
        >
          Submit
        </button>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}
