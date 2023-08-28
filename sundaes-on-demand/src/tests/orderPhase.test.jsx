import { render, screen, waitFor } from "@testing-library/react";
import App from "../App";
import userEvent from "@testing-library/user-event";
import { useEffect } from "react";

test("order phases for happy path", async () => {
  render(<App />);
  //Adding ice cream scoops:
  const vanilaScoop = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  userEvent.clear(vanilaScoop);
  userEvent.type(vanilaScoop, "2");

  const chocolateScoop = await screen.findByRole("spinbutton", {
    name: "Chocolate",
  });
  userEvent.clear(chocolateScoop);
  userEvent.type(chocolateScoop, "1");

  // Adding ice cream oppings

  const cherriesCheckbox = await screen.findByRole("checkbox", {
    name: "Cherries",
  });
  userEvent.clear(cherriesCheckbox);
  userEvent.click(cherriesCheckbox);

  const mms = await screen.findByRole("checkbox", {
    name: "M&Ms",
  });
  userEvent.clear(mms);
  userEvent.click(mms);

  const hotFudge = await screen.findByRole("checkbox", {
    name: "Hot fudge",
  });
  userEvent.clear(hotFudge);
  userEvent.click(hotFudge);

  // find and click order button on summary page
  const orderSummaryButton = await screen.findByRole("button", {
    name: /order sundae/i,
  });
  userEvent.click(orderSummaryButton);

  // check summary information based on order
  const summaryHeading = await screen.findByRole("heading", {
    name: "Order Summary",
  });
  expect(summaryHeading).toBeInTheDocument();

  const scoopsHeading = await screen.findByRole("heading", {
    name: "Scoops: $6.00",
  });
  expect(scoopsHeading).toBeInTheDocument();

  const toppingsHeading = await screen.findByRole("heading", {
    name: "Toppings: $4.50",
  });

  expect(toppingsHeading).toBeInTheDocument();

  // check summary option items
  expect(screen.getByText("2 Vanilla")).toBeInTheDocument();
  expect(screen.getByText("1 Chocolate")).toBeInTheDocument();
  expect(screen.getByText("Cherries")).toBeInTheDocument();

  // accept terms and conditions and click button to confirm order
  const tcCheckbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  userEvent.click(tcCheckbox);

  const confirmOrderButton = screen.getByRole("button", {
    name: /confirm order/i,
  });
  userEvent.click(confirmOrderButton);

  // confirm order number on confirmation page
  const thankYouHeader = await screen.findByRole("heading", {
    name: /thank you/i,
  });
  userEvent.click(thankYouHeader);

  const loading = screen.queryByText("loading");
  expect(loading).not.toBeInTheDocument();

  const orderNumber = await screen.findByText(/order number/i);
  expect(orderNumber).toBeInTheDocument();

  const newOrderButton = screen.getByRole("button", {
    name: /create new order/i,
  });
  userEvent.click(newOrderButton);

  // check that scoops and toppings subtotals have been reset
  waitFor(() =>
    expect(screen.getByText("Scoops total: $0.00")).toBeInTheDocument()
  );
  waitFor(() =>
    expect(screen.getByText("Toppings total: $0.00")).toBeInTheDocument()
  );
});

test("Toppings header is not on summary page if no toppings ordered", async () => {
  render(<App />);

  const vanillaScoop = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  userEvent.clear(vanillaScoop);
  userEvent.type(vanillaScoop, "2");

  const chocolateScoop = await screen.findByRole("spinbutton", {
    name: "Chocolate",
  });

  userEvent.clear(chocolateScoop);
  userEvent.type(chocolateScoop, "1");

  const orderSummaryButton = await screen.findByRole("button", {
    name: /order sundae/i,
  });
  userEvent.click(orderSummaryButton);

  const toppingsHeader = screen.queryByRole("heading", {
    name: "Toppings: $4.50",
  });
  expect(toppingsHeader).not.toBeInTheDocument();

  const ScoopsHeading = screen.queryByText("Scoops total: $6.00");
  expect(ScoopsHeading).toBeInTheDocument();
});
