import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { WorkoutCard } from "../components/workoutCard";
import { Intensity } from ".prisma/client";
import { PageTitle } from "../components/PageTitle";

const workout = {
  id: "123",
  title: "Maxvoima",
  description: "Testi",
  intensity: "HARD" as Intensity,
  userId: "123",
};

const refetch = () => {
  console.log("test");
};

describe("IncreaseButton", () => {
  test("renders", () => {
    const RenderCard = () => {
      return (
        <>
          <WorkoutCard refetch={refetch} {...workout} />
        </>
      );
    };
    render(<RenderCard />);
    expect(screen.getByText("Maxvoima")).toBeDefined();
  });
});

describe("Test Header", () => {
  test("renders", () => {
    render(<PageTitle title="Test" />);
    expect(screen.getByText("Test")).toBeDefined();
  });
});
