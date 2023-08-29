import { render, screen } from "@testing-library/react";
import App from "../App";
import userEvent from "@testing-library/user-event";
//has to be at a clobal scope...

test("order phases for happy path", async () => {
  const { unmount } = render(<App />);
  const user = userEvent;

  //Adding ice cream scoops: price per scoop is = 2
  const vanilaScoop = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  user.clear(vanilaScoop);
  await user.type(vanilaScoop, "1");

  const chocolateScoop = await screen.findByRole("spinbutton", {
    name: "Chocolate",
  });
  user.clear(chocolateScoop);
  await user.type(chocolateScoop, "1");

  // Adding ice cream oppings

  const cherriesCheckbox = await screen.findByRole("checkbox", {
    name: "Cherries",
  });
  user.clear(cherriesCheckbox);
  await user.click(cherriesCheckbox);

  const mms = await screen.findByRole("checkbox", {
    name: "M&Ms",
  });
  user.clear(mms);
  await user.click(mms);

  const hotFudge = await screen.findByRole("checkbox", {
    name: "Hot fudge",
  });
  user.clear(hotFudge);
  await user.click(hotFudge);

  // find and click order button on summary page
  const orderSummaryButton = await screen.findByRole("button", {
    name: /order sundae/i,
  });
  await user.click(orderSummaryButton);

  // check summary information based on order
  const summaryHeading = await screen.findByRole("heading", {
    name: "Order Summary",
  });
  expect(summaryHeading).toBeInTheDocument();

  const scoopsHeading = await screen.findByRole("heading", {
    name: "Scoops: $4.00",
  });
  expect(scoopsHeading).toBeInTheDocument();

  const toppingsHeading = await screen.findByRole("heading", {
    name: "Toppings: $4.50",
  });
  expect(toppingsHeading).toBeInTheDocument();

  // check summary option items
  expect(screen.getByText("1 Vanilla")).toBeInTheDocument();
  expect(screen.getByText("1 Chocolate")).toBeInTheDocument();
  expect(screen.getByText("Cherries")).toBeInTheDocument();
  expect(screen.getByText("M&Ms")).toBeInTheDocument();
  expect(screen.getByText("Hot fudge")).toBeInTheDocument();

  // accept terms and conditions and click button to confirm order
  const tcCheckbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  await user.click(tcCheckbox);

  const confirmOrderButton = screen.getByRole("button", {
    name: /confirm order/i,
  });
  await user.click(confirmOrderButton);

  // confirm order number on confirmation page
  const thankYouHeader = await screen.findByRole("heading", {
    name: /thank you/i,
  });
  await user.click(thankYouHeader);

  const loading = screen.queryByText("loading");
  expect(loading).not.toBeInTheDocument();

  const orderNumber = await screen.findByText(/order number/i);
  expect(orderNumber).toBeInTheDocument();

  const newOrderButton = screen.getByRole("button", {
    name: /create new order/i,
  });
  await user.click(newOrderButton);

  // check that scoops and toppings subtotals have been reset
  expect(screen.getByText("Scoops total: $0.00")).toBeInTheDocument();

  expect(screen.getByText("Toppings total: $0.00")).toBeInTheDocument();

  unmount();
});

test("Toppings header is not on summary page if no toppings ordered", async () => {
  render(<App />);
  const user = userEvent;

  const vanillaScoop = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  user.clear(vanillaScoop);
  user.type(vanillaScoop, "1");

  const chocolateScoop = await screen.findByRole("spinbutton", {
    name: "Chocolate",
  });

  user.clear(chocolateScoop);
  user.type(chocolateScoop, "1");

  const orderSummaryButton = await screen.findByRole("button", {
    name: /order sundae/i,
  });
  await user.click(orderSummaryButton);

  const toppingsHeader = screen.queryByRole("heading", {
    name: "Toppings: $4.50",
  });
  expect(toppingsHeader).not.toBeInTheDocument();

  const ScoopsHeading = screen.queryByRole("heading", {
    name: "Scoops: $4.00",
  });
  expect(ScoopsHeading).toBeInTheDocument();
});
