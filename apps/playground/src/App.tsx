import { useEffect, useState } from "react";
import {
  ArrowLeft, Bell, Heart, House, Info, MapPin, Mic, Moon, Search, Share2, ShoppingBag, SlidersHorizontal, Sun, Tag, Trash2, User, Pencil, Copy,
} from "lucide-react";
import {
  Accordion, AccordionItem, Alert, AppBar, Avatar, AvatarGroup, Badge, BillSummary, BottomSheet, Button, Card, CartBar, Checkbox, CheckboxGroup,
  Chip, ChipGroup, Counter, Dialog, DialogTrigger, Divider, EmptyState, IconButton, Kbd, Link, ListItem, LiveIndicator, Menu, MenuItem,
  MenuTrigger, OTPInput, OfferTag, PhoneField, Price, ProgressBar, ProgressRing, QuantityStepper, Radio, RadioGroup, Rating, SearchField,
  SegmentedControl, Select, SelectItem, Skeleton, Slider, Spinner, StatusDot, Switch, Tab, TabBar, TabList, TabPanel, Tabs, TextField,
  Thumbnail, ToastRegion, Tooltip, TooltipTrigger, VegMark, createToastQueue,
} from "@brahmastra/ui";

const toasts = createToastQueue();

const DISHES = [
  { id: "dosa", name: "Ghee podi masala dosa", price: 140, mrp: 160, veg: true, img: "/masala-dosa.png", note: "Crisp dosa brushed with ghee and gunpowder podi, served with chutneys." },
  { id: "idli", name: "Thatte idli with benne", price: 90, veg: true, img: "/thatte-idli.png", note: "Plate-sized soft idli with a generous slab of white butter." },
  { id: "coffee", name: "Filter coffee", price: 40, veg: true, img: "/filter-coffee.png", note: "Chicory-blend decoction, frothed by hand, served in a dabara." },
];

function Phone() {
  const [cart, setCart] = useState<Record<string, number>>({ dosa: 1 });
  const [section, setSection] = useState<string>("recommended");
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = DISHES.reduce((sum, d) => sum + (cart[d.id] ?? 0) * d.price, 0);
  const toFree = Math.max(0, 299 - total);
  return (
    <div className="pg-phone">
      <div className="pg-status"><span>9:41</span><span>5G ▮▮▮</span></div>
      <AppBar
        leading={<IconButton variant="ghost" aria-label="Back" icon={<ArrowLeft />} />}
        title="Rameshwaram Cafe"
        actions={<><IconButton variant="ghost" aria-label="Add to favourites" icon={<Heart />} /><IconButton variant="ghost" aria-label="Share" icon={<Share2 />} /></>}
      />
      <div className="pg-phone-scroll">
        <div className="pg-pad">
          <div className="pg-row">
            <Rating value={4.3} count={2140} />
            <span className="astra-text-body-sm" style={{ color: "var(--astra-color-fg-muted)" }}>South Indian · Indiranagar · 25 min</span>
          </div>
          <div className="pg-row">
            <OfferTag type="inline" icon={<Tag size={14} />}>50% off up to ₹100</OfferTag>
            <OfferTag type="benefit">Free delivery above ₹299</OfferTag>
          </div>
          <SegmentedControl aria-label="Order type" defaultSelectedKeys={["delivery"]} options={[{ id: "delivery", label: "Delivery" }, { id: "takeaway", label: "Takeaway" }, { id: "dine", label: "Dine in" }]} />
          <Tabs selectedKey={section} onSelectionChange={(k) => setSection(String(k))}>
            <TabList aria-label="Menu sections">
              <Tab id="recommended">Recommended</Tab>
              <Tab id="dosa">Dosa</Tab>
              <Tab id="idli">Idli & Vada</Tab>
              <Tab id="drinks">Beverages</Tab>
            </TabList>
          </Tabs>
          <div>
            {DISHES.map((d) => (
              <div className="pg-dish" key={d.id}>
                <div className="pg-dish-text">
                  <div className="pg-row" style={{ gap: 8 }}>
                    <VegMark type={d.veg ? "veg" : "non-veg"} />
                    {d.id === "dosa" && <Badge tone="warning">Bestseller</Badge>}
                  </div>
                  <span className="astra-text-heading-xs">{d.name}</span>
                  <Price value={d.price} mrp={d.mrp} size="sm" />
                  <span className="astra-text-body-sm" style={{ color: "var(--astra-color-fg-muted)" }}>{d.note}</span>
                </div>
                <div className="pg-dish-media">
                  <Thumbnail src={d.img} alt="" size="lg" />
                  <QuantityStepper itemName={d.name} value={cart[d.id] ?? 0} onChange={(v) => setCart((c) => ({ ...c, [d.id]: v }))} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="pg-phone-bottom">
        {count > 0 && (
          <CartBar
            href="#cart"
            count={count}
            total={total}
            nudge={toFree > 0 ? { message: `Add ₹${toFree} more for free delivery`, progress: total / 299 } : { message: "Yay! Free delivery unlocked", unlocked: true }}
          />
        )}
        <TabBar
          type="floating"
          currentId="home"
          items={[
            { id: "home", label: "Home", href: "#home", icon: <House /> },
            { id: "search", label: "Search", href: "#search", icon: <Search /> },
            { id: "orders", label: "Orders", href: "#orders", icon: <ShoppingBag />, badge: 3 },
            { id: "account", label: "Account", href: "#account", icon: <User /> },
          ]}
        />
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="pg-sec">
      <h2 className="astra-text-heading-md">{title}</h2>
      {children}
    </section>
  );
}

function Box({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="pg-card">
      <span className="pg-label">{label}</span>
      {children}
    </div>
  );
}

export function App() {
  const [dark, setDark] = useState(false);
  const [phone, setPhone] = useState("");
  const [qty, setQty] = useState(0);
  const [loading, setLoading] = useState(false);
  useEffect(() => document.documentElement.setAttribute("data-astra-mode", dark ? "dark" : "light"), [dark]);

  return (
    <div className="pg">
      <Phone />
      <div className="pg-sink">
        <div className="pg-head">
          <div>
            <p className="pg-label" style={{ margin: 0 }}>Brahmāstra · @brahmastra/ui</p>
            <h1 className="astra-text-display-md" style={{ margin: "4px 0 0" }}>Playground</h1>
          </div>
          <Button variant="outline" leadingIcon={dark ? <Sun /> : <Moon />} onPress={() => setDark((d) => !d)}>
            {dark ? "Light" : "Dark"} mode
          </Button>
        </div>

        <Section title="Actions">
          <div className="pg-grid">
            <Box label="Button · variants">
              <div className="pg-row">
                <Button>Pay ₹312</Button>
                <Button variant="secondary">Save</Button>
                <Button variant="outline">Edit</Button>
                <Button variant="ghost">Skip</Button>
                <Button variant="danger" leadingIcon={<Trash2 />}>Remove</Button>
              </div>
            </Box>
            <Box label="Button · sizes, loading, disabled">
              <div className="pg-row">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
              <div className="pg-row">
                <Button isLoading={loading} loadingLabel="Placing order" onPress={() => { setLoading(true); setTimeout(() => setLoading(false), 1800); }}>Place order</Button>
                <Button isDisabled>Disabled</Button>
              </div>
            </Box>
            <Box label="Icon button · Link · Kbd">
              <div className="pg-row">
                <IconButton aria-label="Notifications" icon={<Bell />} />
                <IconButton variant="secondary" aria-label="Add to favourites" icon={<Heart />} />
                <IconButton variant="outline" aria-label="Filters" icon={<SlidersHorizontal />} />
                <IconButton variant="ghost" size="sm" aria-label="Share" icon={<Share2 />} />
              </div>
              <div className="pg-row">
                <Link href="#" showArrow>View all restaurants</Link>
                <Link href="https://mayurchoudhary.in" isExternal size="sm">mayurchoudhary.in</Link>
              </div>
              <div className="pg-row"><span className="astra-text-body-sm">Search</span><Kbd>⌘</Kbd><Kbd>K</Kbd></div>
            </Box>
          </div>
        </Section>

        <Section title="Forms, made for India">
          <div className="pg-grid">
            <Box label="Phone field · +91">
              <PhoneField value={phone} onChange={setPhone} description="We'll text you a 6-digit code" validationBehavior="aria" />
              <span className="astra-text-body-xs" style={{ color: "var(--astra-color-fg-muted)" }}>Value: {phone || "—"} (try pasting +91 98765-43210)</span>
            </Box>
            <Box label="OTP · fills from SMS">
              <OTPInput onComplete={(c) => toasts.add({ title: `Code ${c} verified`, tone: "success" })} description="Resend in 0:24" />
            </Box>
            <Box label="Text field · states">
              <TextField label="Flat, floor, building" necessityIndicator="optional" placeholder="e.g. 4th Cross, HAL 2nd Stage" />
              <TextField label="Email" defaultValue="mayur@" isInvalid errorMessage="Enter a full email, like name@domain.com" />
              <TextField label="Delivery note" multiline placeholder="Leave at the door" />
            </Box>
            <Box label="Search · Select">
              <SearchField placeholder="Search dishes, restaurants" trailing={<Mic size={20} />} />
              <Select label="City" placeholder="Choose a city">
                {["Bengaluru", "Mumbai", "Delhi NCR", "Chennai", "Hyderabad", "Pune", "Kolkata"].map((c) => <SelectItem key={c} id={c}>{c}</SelectItem>)}
              </Select>
            </Box>
          </div>
        </Section>

        <Section title="Selection">
          <div className="pg-grid">
            <Box label="Checkbox · Radio">
              <CheckboxGroup label="Diet" defaultValue={["veg"]}>
                <Checkbox value="veg" description="Only show vegetarian dishes">Pure veg</Checkbox>
                <Checkbox value="jain">Jain (no onion, no garlic)</Checkbox>
                <Checkbox value="egg" isDisabled>Egg dishes</Checkbox>
              </CheckboxGroup>
              <RadioGroup label="Pay with" defaultValue="upi">
                <Radio value="upi" description="Instant refund if anything goes wrong">UPI · mayur@okhdfc</Radio>
                <Radio value="card">Credit card •••• 4242</Radio>
                <Radio value="cod">Pay on delivery</Radio>
              </RadioGroup>
            </Box>
            <Box label="Switch · Chips · Segmented">
              <Switch defaultSelected description="Rider leaves food at the door">Contactless delivery</Switch>
              <Switch>Dark mode</Switch>
              <ChipGroup aria-label="Filters" defaultSelectedKeys={["rating"]}>
                <Chip id="veg">Pure veg</Chip>
                <Chip id="rating">Rating 4.0+</Chip>
                <Chip id="fast">Under 30 min</Chip>
                <Chip id="offers">Offers</Chip>
              </ChipGroup>
              <SegmentedControl aria-label="Sort" defaultSelectedKeys={["rel"]} options={[{ id: "rel", label: "Relevance" }, { id: "rating", label: "Rating" }, { id: "time", label: "Time" }]} />
            </Box>
            <Box label="Slider · Stepper">
              <Slider label="Price for two" defaultValue={[200, 800]} minValue={0} maxValue={1500} step={50} formatOptions={{ style: "currency", currency: "INR", maximumFractionDigits: 0 }} />
              <Slider label="Distance" defaultValue={5} minValue={1} maxValue={15} formatOptions={{ style: "unit", unit: "kilometer" }} />
              <div className="pg-row"><QuantityStepper itemName="Filter coffee" value={qty} onChange={setQty} /><QuantityStepper itemName="Vada" value={2} onChange={() => {}} isDisabled /></div>
            </Box>
          </div>
        </Section>

        <Section title="Status & feedback">
          <div className="pg-grid">
            <Box label="Badge · Counter · Status · Live">
              <div className="pg-row">
                <Badge>Draft</Badge><Badge tone="accent">New</Badge><Badge tone="success" dot>Open now</Badge><Badge tone="warning">Delayed</Badge>
                <Badge tone="danger" emphasis="solid">Cancelled</Badge><Badge tone="info" emphasis="solid">On the way</Badge>
              </div>
              <div className="pg-row">
                <Counter count={3} /><Counter count={120} /><Counter dot />
                <StatusDot status="online" /><StatusDot status="away" />
                <LiveIndicator>Live tracking</LiveIndicator><LiveIndicator tone="live">Live</LiveIndicator>
              </div>
            </Box>
            <Box label="Progress · Spinner · Skeleton">
              <ProgressBar label="Uploading menu photos" value={60} />
              <ProgressBar label="Upload complete" value={100} />
              <div className="pg-row"><ProgressRing value={25} aria-label="Profile" size="sm" /><ProgressRing value={75} aria-label="Profile" /><ProgressRing value={100} aria-label="Profile" size="lg" /><Spinner /><Spinner size="lg" /></div>
              <div className="pg-row" style={{ flexWrap: "nowrap" }}><Skeleton shape="circle" /><Skeleton lines={3} /></div>
            </Box>
            <Box label="Alerts · Toast">
              <Alert tone="success" title="Order placed">Rameshwaram Cafe has your order.</Alert>
              <Alert tone="warning" title="Heavy rain in your area" onDismiss={() => {}}>Deliveries may take 10 minutes longer.</Alert>
              <Alert tone="danger" title="Payment failed" actions={<Button size="sm" variant="outline">Try again</Button>}>Your bank didn't confirm the payment. No money was taken.</Alert>
              <div className="pg-row">
                <Button variant="outline" onPress={() => toasts.add({ title: "Added to cart" })}>Show toast</Button>
                <Button variant="outline" onPress={() => toasts.add({ title: "Item removed", action: { label: "Undo", onAction: () => {} } })}>With undo</Button>
              </div>
            </Box>
          </div>
        </Section>

        <Section title="Overlays">
          <div className="pg-row">
            <DialogTrigger>
              <Button variant="danger">Remove items</Button>
              <Dialog role="alertdialog" title="Remove 2 items?" description="You can add them back from the menu." actions={(close) => <><Button variant="outline" onPress={close}>Keep</Button><Button variant="danger" onPress={close}>Remove</Button></>} />
            </DialogTrigger>
            <DialogTrigger>
              <Button variant="outline" leadingIcon={<SlidersHorizontal />}>Filters</Button>
              <BottomSheet title="Filters" footer={(close) => <><Button variant="ghost" onPress={close}>Clear all</Button><Button onPress={close}>Show 43 restaurants</Button></>}>
                <div style={{ display: "grid", gap: 20 }}>
                  <span className="astra-text-label-lg">Sort by</span>
                  <ChipGroup aria-label="Sort by" selectionMode="single" defaultSelectedKeys={["rel"]}><Chip id="rel">Relevance</Chip><Chip id="rat">Rating</Chip><Chip id="time">Delivery time</Chip></ChipGroup>
                  <span className="astra-text-label-lg">Diet</span>
                  <ChipGroup aria-label="Diet" defaultSelectedKeys={["veg"]}><Chip id="veg">Pure veg</Chip><Chip id="egg">Egg</Chip><Chip id="non">Non-veg</Chip></ChipGroup>
                  <Slider label="Price for two" defaultValue={[200, 800]} minValue={0} maxValue={1500} step={50} formatOptions={{ style: "currency", currency: "INR", maximumFractionDigits: 0 }} />
                </div>
              </BottomSheet>
            </DialogTrigger>
            <MenuTrigger>
              <Button variant="outline">More ▾</Button>
              <Menu aria-label="Order actions">
                <MenuItem icon={<Pencil size={20} />}>Edit order</MenuItem>
                <MenuItem icon={<Copy size={20} />} shortcut="⌘D">Duplicate</MenuItem>
                <MenuItem icon={<Trash2 size={20} />} tone="danger">Cancel order</MenuItem>
              </Menu>
            </MenuTrigger>
            <TooltipTrigger>
              <IconButton variant="ghost" aria-label="About platform fee" icon={<Info />} />
              <Tooltip>₹5 helps us run the app and support delivery partners.</Tooltip>
            </TooltipTrigger>
          </div>
        </Section>

        <Section title="Content">
          <div className="pg-grid">
            <Card href="#r" title="Rameshwaram Cafe" media={<img src="/darshini-spread.png" alt="" />} footer={<OfferTag type="inline">50% off up to ₹100</OfferTag>}>
              <div className="pg-row" style={{ gap: 8 }}><Rating value={4.3} count={2140} /><span className="astra-text-body-sm" style={{ color: "var(--astra-color-fg-muted)" }}>South Indian · 1.2 km · 25 min</span></div>
            </Card>
            <BillSummary
              lines={[
                { label: "Item total", amount: 280 },
                { label: "Delivery fee", amount: 0, originalAmount: 40 },
                { label: "Platform fee", amount: 5, info: <TooltipTrigger><IconButton variant="ghost" size="sm" aria-label="About platform fee" icon={<Info />} /><Tooltip>Helps us run the app.</Tooltip></TooltipTrigger> },
                { label: "GST and restaurant charges", amount: 14 },
              ]}
              total={299}
              savings={51}
            />
            <div className="pg-card" style={{ padding: 0, overflow: "hidden" }}>
              <ListItem title="Saved addresses" leading={<MapPin size={20} />} href="#a" />
              <Divider variant="inset" />
              <ListItem title="Ravi Kumar" subtitle="Delivery partner · ★ 4.8" leading={<Avatar name="Ravi Kumar" decorative status="online" />} trailing="2 min away" />
              <Divider variant="inset" />
              <ListItem title="Notifications" leading={<Bell size={20} />} trailing={<Switch aria-label="Notifications" defaultSelected />} />
            </div>
            <Box label="Avatar · Accordion">
              <div className="pg-row">
                <Avatar name="Mayur Choudhary" size="xs" /><Avatar name="Mayur Choudhary" size="sm" /><Avatar name="Asha" size="md" status="online" />
                <Avatar size="lg" /><Avatar name="Ananya R" size="xl" src="/coffee-bar.png" />
                <AvatarGroup>{[<Avatar key="1" name="A B" />, <Avatar key="2" name="C D" />, <Avatar key="3" name="E F" />, <Avatar key="4" name="G H" />, <Avatar key="5" name="I J" />, <Avatar key="6" name="K L" />]}</AvatarGroup>
              </div>
              <Accordion>
                <AccordionItem title="Where is my order?">Open Orders and tap the live tracker. You'll see the ETA and can call your partner.</AccordionItem>
                <AccordionItem title="How do refunds work?">Refunds to UPI arrive in 2–4 hours; to cards in 5–7 working days.</AccordionItem>
              </Accordion>
            </Box>
            <div className="pg-card"><EmptyState icon={<ShoppingBag />} title="Your cart is empty" description="Good food is always cooking. Add something from a menu." action={<Button>Browse restaurants</Button>} /></div>
            <Box label="Tab bar · types">
              {(["classic", "expanding", "icon-only"] as const).map((t) => (
                <TabBar key={t} type={t} currentId="home" aria-label={`Example ${t}`} items={[{ id: "home", label: "Home", href: "#", icon: <House /> }, { id: "search", label: "Search", href: "#", icon: <Search /> }, { id: "orders", label: "Orders", href: "#", icon: <ShoppingBag />, badge: 3 }, { id: "me", label: "Account", href: "#", icon: <User /> }]} />
              ))}
            </Box>
          </div>
        </Section>
      </div>
      <ToastRegion toasts={toasts} />
    </div>
  );
}
