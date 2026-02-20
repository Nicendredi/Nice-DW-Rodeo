import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

function TestComponent() {
  return <div>Test component</div>;
}

describe("app setup", () => {
  it("renders a component using testing-library", () => {
    render(<TestComponent />);
    expect(screen.getByText("Test component")).toBeInTheDocument();
  });
});
