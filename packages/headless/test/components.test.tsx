import { act, fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import axe from "axe-core";
import { useState } from "react";
import {
  Avatar,
  BillSummary,
  Button,
  Checkbox,
  Counter,
  Dialog,
  DialogTrigger,
  IconButton,
  OTPInput,
  PhoneField,
  Price,
  QuantityStepper,
  Rating,
  Switch,
  TabBar,
  VegMark,
} from "../src/index.js";

describe("Button", () => {
  it("is a real button that responds to presses", async () => {
    const onPress = vi.fn();
    render(<Button onPress={onPress}>Place order</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Place order" }));
    expect(onPress).toHaveBeenCalledOnce();
  });

  it("while loading: blocks presses, keeps its name and announces progress", async () => {
    const onPress = vi.fn();
    render(<Button isLoading loadingLabel="Placing order" onPress={onPress}>Place order</Button>);
    const button = screen.getByRole("button", { name: /Place order/ });
    await userEvent.click(button);
    expect(onPress).not.toHaveBeenCalled();
    expect(button).toHaveAttribute("data-pending", "true");
    expect(screen.getByRole("progressbar", { name: "Placing order" })).toBeTruthy();
  });

  it("exposes its look as data attributes for any CSS", () => {
    render(<Button variant="danger" size="lg">Delete</Button>);
    const b = screen.getByRole("button");
    expect(b.className).toContain("astra-button");
    expect(b).toHaveAttribute("data-variant", "danger");
    expect(b).toHaveAttribute("data-size", "lg");
  });

  it("IconButton is named by aria-label, not by its icon", () => {
    render(<IconButton aria-label="Add to favourites" icon={<svg />} />);
    expect(screen.getByRole("button", { name: "Add to favourites" })).toBeTruthy();
  });
});

describe("PhoneField", () => {
  it("formats as 98765 43210 and reports only the 10 digits", async () => {
    const onChange = vi.fn();
    render(<PhoneField onChange={onChange} />);
    const input = screen.getByLabelText("Mobile number") as HTMLInputElement;
    await userEvent.type(input, "9876543210");
    expect(input.value).toBe("98765 43210");
    expect(onChange).toHaveBeenLastCalledWith("9876543210");
    expect(input).toHaveAttribute("type", "tel");
    expect(input).toHaveAttribute("autocomplete", "tel-national");
  });

  it("cleans pasted numbers with +91, spaces and dashes", async () => {
    const onChange = vi.fn();
    render(<PhoneField onChange={onChange} />);
    const input = screen.getByLabelText("Mobile number");
    await userEvent.click(input);
    await userEvent.paste("+91 98765-43210");
    expect(onChange).toHaveBeenLastCalledWith("9876543210");
  });

  it("marks numbers that can't be Indian mobiles as invalid", async () => {
    render(<PhoneField validationBehavior="aria" />);
    const input = screen.getByLabelText("Mobile number");
    await userEvent.type(input, "12345");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });
});

describe("OTPInput", () => {
  it("is one input that SMS autofill and paste can fill", async () => {
    const onComplete = vi.fn();
    render(<OTPInput onComplete={onComplete} />);
    const input = screen.getByLabelText("Enter the code we sent you");
    expect(input).toHaveAttribute("autocomplete", "one-time-code");
    expect(input).toHaveAttribute("inputmode", "numeric");
    await userEvent.click(input);
    await userEvent.paste("123-456");
    expect(onComplete).toHaveBeenCalledWith("123456");
  });
});

describe("Commerce", () => {
  it("Price reads as ₹280, was ₹350, 20% off", () => {
    const { container } = render(<Price value={280} mrp={350} />);
    expect(container.textContent).toBe("₹280, was₹35020% off");
    expect(container.querySelector("s")?.textContent).toBe("₹350");
  });

  it("Price shows FREE with the struck original", () => {
    const { container } = render(<Price value={0} mrp={40} />);
    expect(container.textContent).toContain("FREE");
    expect(container.textContent).not.toContain("off");
  });

  it("VegMark is an image with a spoken name", () => {
    render(<VegMark type="non-veg" />);
    expect(screen.getByRole("img", { name: "Non-vegetarian" })).toBeTruthy();
  });

  it("QuantityStepper goes ADD → − 1 + and labels every button", async () => {
    function Harness() {
      const [n, setN] = useState(0);
      return <QuantityStepper value={n} onChange={setN} itemName="Filter coffee" />;
    }
    render(<Harness />);
    await userEvent.click(screen.getByRole("button", { name: "ADD Filter coffee" }));
    expect(screen.getByRole("group", { name: "Filter coffee quantity" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Add one more Filter coffee" })).toHaveFocus();
    await userEvent.click(screen.getByRole("button", { name: "Add one more Filter coffee" }));
    expect(screen.getByRole("status").textContent).toContain("2");
    await userEvent.click(screen.getByRole("button", { name: "Remove one Filter coffee" }));
    await userEvent.click(screen.getByRole("button", { name: "Remove one Filter coffee" }));
    expect(screen.getByRole("button", { name: "ADD Filter coffee" })).toHaveFocus();
  });

  it("BillSummary lists every line and the total", () => {
    render(<BillSummary lines={[{ label: "Item total", amount: 280 }, { label: "Delivery fee", amount: 0, originalAmount: 40 }]} total={299} savings={51} />);
    expect(screen.getByText("Item total")).toBeTruthy();
    expect(screen.getByText("₹299")).toBeTruthy();
    expect(screen.getByText("You saved ₹51 on this order")).toBeTruthy();
  });
});

describe("Atoms", () => {
  it("Counter caps at 99+ and disappears at 0", () => {
    const { container, rerender } = render(<Counter count={120} />);
    expect(container.textContent).toBe("99+");
    rerender(<Counter count={0} />);
    expect(container.textContent).toBe("");
  });

  it("Avatar falls back to initials when the photo fails", () => {
    render(<Avatar name="Mayur Choudhary" src="/broken.jpg" />);
    const img = document.querySelector("img")!;
    fireEvent.error(img);
    expect(screen.getByRole("img", { name: "Mayur Choudhary" }).textContent).toBe("MC");
  });

  it("Rating is spoken as a sentence", () => {
    render(<Rating value={4.3} count={2140} />);
    expect(screen.getByRole("img", { name: "4.3 out of 5, 2,140 ratings" })).toBeTruthy();
  });
});

describe("Selection", () => {
  it("Checkbox toggles from the whole row", async () => {
    render(<Checkbox>Send order updates on WhatsApp</Checkbox>);
    const box = screen.getByRole("checkbox", { name: "Send order updates on WhatsApp" });
    await userEvent.click(screen.getByText("Send order updates on WhatsApp"));
    expect(box).toBeChecked();
  });

  it("Switch is a switch", () => {
    render(<Switch>Contactless delivery</Switch>);
    expect(screen.getByRole("switch", { name: "Contactless delivery" })).toBeTruthy();
  });
});

describe("TabBar", () => {
  const items = [
    { id: "home", label: "Home", href: "/", icon: <svg /> },
    { id: "orders", label: "Orders", href: "/orders", icon: <svg />, badge: 3 },
  ];
  it("is a nav of links with aria-current, and badges are in the name", () => {
    render(<TabBar items={items} currentId="home" />);
    expect(screen.getByRole("navigation", { name: "Main" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Orders, 3 new" })).not.toHaveAttribute("aria-current");
  });
});

describe("Dialog", () => {
  it("opens from its trigger, is labelled by its title and closes on Escape", async () => {
    render(
      <DialogTrigger>
        <Button>Remove items</Button>
        <Dialog title="Remove 2 items?" description="You can add them again later." actions={(close) => <Button onPress={close}>Cancel</Button>} />
      </DialogTrigger>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Remove items" }));
    const dialog = screen.getByRole("dialog", { name: "Remove 2 items?" });
    expect(dialog).toBeTruthy();
    await userEvent.keyboard("{Escape}");
    await act(() => new Promise((r) => setTimeout(r, 0)));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("Accessibility scan (axe-core)", () => {
  it("finds no violations across the kit", async () => {
    const { container } = render(
      <main>
        <Button>Pay ₹312</Button>
        <IconButton aria-label="Share" icon={<svg />} />
        <PhoneField />
        <OTPInput />
        <Checkbox>Pure veg only</Checkbox>
        <Switch>Dark mode</Switch>
        <Price value={280} mrp={350} />
        <VegMark type="veg" />
        <Rating value={4.3} count={2140} />
        <Avatar name="Asha" />
        <TabBar items={[{ id: "home", label: "Home", href: "/", icon: <svg /> }]} currentId="home" />
        <BillSummary lines={[{ label: "Item total", amount: 280 }]} total={280} />
      </main>,
    );
    const results = await axe.run(container, { rules: { region: { enabled: false } } });
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
  });
});
