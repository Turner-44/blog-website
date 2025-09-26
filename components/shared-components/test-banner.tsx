export default function TestBanner() {
  return (
    <main data-testid="banner-environment-notification">
      <div className="bg-red-600 p-3">
        <h2 className="text-center">YOU ARE USING TEST VARIABLES.</h2>
      </div>
    </main>
  );
}
