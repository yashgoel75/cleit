export default function Footer() {
  const fullDate = new Date();
  const year = fullDate.getFullYear();
  return (
    <>
      <div className="bottom-0 text-center py-4 bg-gray-100 w-full">
        &copy;&nbsp;{year} Cleit. All rights reserved.
      </div>
    </>
  );
}
