import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Char "mo:core/Char";

actor {
  type Pact = {
    name : Text;
    currency : Text;
    createdAt : Int;
    createdBy : Principal;
    isActive : Bool;
  };

  type ImageData = {
    data : Blob;
    contentType : Text;
  };

  type ShoppingList = {
    id : Nat;
    name : Text;
    items : [ShoppingListItem];
  };

  type ShoppingListItem = {
    id : Nat;
    amount : Nat;
    completed : Bool;
  };

  type ListItem = {
    id : Nat;
    name : Text;
  };

  type ShoppingListItemResponse = {
    id : Nat;
    name : Text;
    amount : Nat;
    completed : Bool;
  };

  type ShoppingListResponse = {
    id : Nat;
    name : Text;
    items : [ShoppingListItemResponse];
  };

  type SortOrder = {
    asc : Bool;
  };

  type ListItemPaginationRequest = {
    page : Nat;
    pageSize : Nat;
    sortOrder : SortOrder;
    search : ?Text;
  };

  type ListItemPaginatedResponse = {
    items : [ListItem];
    total : Nat;
    page : Nat;
    pageSize : Nat;
  };

  var index : Nat = 0;

  var isInitialised : Bool = false;

  var shoppingListIndex : Nat = 0;

  var shoppingLists : Map.Map<Nat, ShoppingList> = Map.empty<Nat, ShoppingList>();

  var listItems : Map.Map<Nat, ListItem> = Map.empty<Nat, ListItem>();

  var itemsDefaultList : [Text] = [
    "Apples",
    "Bananas",
    "Oranges",
    "Lemons",
    "Limes",
    "Grapes",
    "Strawberries",
    "Blueberries",
    "Watermelon",
    "Pineapple",
    "Mangoes",
    "Avocados",
    "Lettuce",
    "Spinach",
    "Kale",
    "Arugula",
    "Tomatoes",
    "Cherry Tomatoes",
    "Bell Peppers",
    "Jalapeños",
    "Cucumbers",
    "Zucchini",
    "Carrots",
    "Celery",
    "Potatoes",
    "Sweet Potatoes",
    "Onions",
    "Red Onions",
    "Green Onions",
    "Garlic",
    "Ginger Root",
    "Mushrooms",
    "Broccoli",
    "Cauliflower",
    "Cabbage",
    "Green Beans",
    "Asparagus",
    "Corn on the Cob",
    "Cilantro",
    "Parsley",
    "Basil",
    "Mint",

    "Milk",
    "Almond Milk",
    "Oat Milk",
    "Heavy Cream",
    "Half & Half",
    "Butter",
    "Unsalted Butter",
    "Margarine",
    "Cheddar Cheese",
    "Mozzarella Cheese",
    "Parmesan Cheese",
    "Feta Cheese",
    "Cream Cheese",
    "Yogurt",
    "Greek Yogurt",
    "Sour Cream",
    "Cottage Cheese",
    "Eggs",

    "White Bread",
    "Whole Wheat Bread",
    "Multigrain Bread",
    "Rolls",
    "Buns",
    "Bagels",
    "English Muffins",
    "Croissants",
    "Flour Tortillas",
    "Corn Tortillas",
    "Whole Wheat Tortillas",
    "Pita Bread",

    "Chicken Breasts",
    "Chicken Thighs",
    "Ground Beef",
    "Steaks",
    "Pork Chops",
    "Sausages",
    "Hot Dogs",
    "Bacon",
    "Ham",
    "Ground Turkey",
    "Turkey Slices",
    "Deli Turkey",
    "Deli Ham",
    "Salami",
    "Salmon",
    "Tilapia",
    "Shrimp",
    "Canned Tuna",
    "Canned Salmon",

    "White Rice",
    "Brown Rice",
    "Jasmine Rice",
    "Basmati Rice",
    "Spaghetti",
    "Penne",
    "Macaroni",
    "Egg Noodles",
    "Ramen Noodles",
    "All-Purpose Flour",
    "Whole Wheat Flour",
    "White Sugar",
    "Brown Sugar",
    "Salt",
    "Pepper",
    "Baking Powder",
    "Baking Soda",
    "Yeast",
    "Honey",
    "Maple Syrup",
    "Olive Oil",
    "Vegetable Oil",
    "Coconut Oil",
    "White Vinegar",
    "Apple Cider Vinegar",
    "Balsamic Vinegar",
    "Soy Sauce",
    "Hot Sauce",
    "Ketchup",
    "Mustard",
    "Mayonnaise",
    "Salad Dressing",
    "Peanut Butter",
    "Jelly",
    "Jam",
    "Black Beans",
    "Kidney Beans",
    "Chickpeas",
    "Canned Corn",
    "Canned Peas",
    "Canned Green Beans",
    "Diced Tomatoes",
    "Tomato Puree",
    "Tomato Sauce",
    "Tomato Paste",
    "Chicken Broth",
    "Vegetable Broth",
    "Bouillon Cubes",
    "Pickles",
    "Olives",
    "Pasta Sauce",
    "Oats",
    "Oatmeal",
    "Breakfast Cereal",
    "Granola",

    "Frozen Mixed Vegetables",
    "Frozen Broccoli",
    "Frozen Peas",
    "Frozen Berries",
    "Frozen Mango",
    "Frozen Pizza",
    "Frozen Dinners",
    "Frozen French Fries",
    "Ice Cream",
    "Popsicles",
    "Frozen Waffles",

    "Crackers",
    "Potato Chips",
    "Tortilla Chips",
    "Popcorn",
    "Pretzels",
    "Granola Bars",
    "Protein Bars",
    "Almonds",
    "Cashews",
    "Peanuts",
    "Trail Mix",
    "Raisins",
    "Dried Apricots",
    "Cookies",
    "Candy",
    "Chocolate",

    "Coffee",
    "Coffee Beans",
    "Instant Coffee",
    "Black Tea",
    "Green Tea",
    "Herbal Tea",
    "Bottled Water",
    "Sparkling Water",
    "Orange Juice",
    "Apple Juice",
    "Cranberry Juice",
    "Cola",
    "Lemon-Lime Soda",
    "Sports Drinks",
    "Energy Drinks",
    "Soy Milk",

    "Paper Towels",
    "Toilet Paper",
    "Facial Tissues",
    "Napkins",
    "Trash Bags",
    "Dish Soap",
    "Dishwasher Detergent",
    "Sponges",
    "Scrubbers",
    "Laundry Detergent",
    "Fabric Softener",
    "Stain Remover",
    "All-Purpose Cleaner",
    "Bathroom Cleaner",
    "Kitchen Cleaner",
    "Glass Cleaner",
    "Disinfectant Wipes",
    "Air Freshener",
    "Light Bulbs",
    "Batteries",

    "Shampoo",
    "Conditioner",
    "Body Wash",
    "Soap",
    "Toothpaste",
    "Toothbrushes",
    "Mouthwash",
    "Floss",
    "Deodorant",
    "Razor Blades",
    "Shaving Cream",
    "Hairbrush",
    "Comb",
    "Cotton Swabs",
    "Cotton Balls",
    "Pads",
    "Tampons",
    "Hand Soap",
    "Lotion",
    "Sunscreen",
    "Lip Balm",

    "Diapers",
    "Baby Wipes",
    "Baby Food",
    "Baby Formula",
    "Kids Snacks",
    "Juice Boxes",

    "Dog Food",
    "Cat Food",
    "Pet Treats",
    "Cat Litter",
    "Pet Toys",
  ];

  public shared func init(items : [Text]) : async () {
    if (isInitialised) { Runtime.trap("Already initialised") };
    isInitialised := true;
    ignore await addShoppingList("Shopping List");
    for (item in itemsDefaultList.values()) {
      let itemId = getNextIndex();
      if (items.find(func(i) { i == item }) == null) {
        listItems.add(itemId, { id = itemId; name = item });
      };
    };
    for (item in items.values()) {
      let itemId = getNextIndex();
      listItems.add(itemId, { id = itemId; name = item });
    };
  };

  public shared func isInited() : async Bool {
    isInitialised;
  };

  public shared func addListItem(name : Text) : async (ListItem) {
    Guards.requireItemNotExists(name);
    let itemId = getNextIndex();
    listItems.add(itemId, { id = itemId; name });
    { id = itemId; name };
  };

  public shared func getListItemsPaginated(paginationRequest : ListItemPaginationRequest) : async ListItemPaginatedResponse {
    let items = listItems.values().toArray();
    let total = listItems.size();
    let page = paginationRequest.page;
    let pageSize = paginationRequest.pageSize;

    let filteredItems = items.filter(
      func(item) {
        switch (paginationRequest.search) {
          case (null) { true };
          case (?search) {
            let itemLower = item.name.map(
              func(c) {
                if (c >= 'A' and c <= 'Z') {
                  Char.fromNat32(c.toNat32() + 32);
                } else {
                  c;
                };
              }
            );
            let searchLower = search.map(
              func(c) {
                if (c >= 'A' and c <= 'Z') {
                  Char.fromNat32(c.toNat32() + 32);
                } else {
                  c;
                };
              }
            );
            itemLower.contains(#text searchLower);
          };
        };
      }
    );

    let sortedItems = filteredItems.sort(
      func(a, b) {
        if (paginationRequest.sortOrder.asc) {
          a.name.compare(b.name);
        } else {
          b.name.compare(a.name);
        };
      }
    );

    let paginatedItems = Array.tabulate(
      Nat.min(pageSize, sortedItems.size() - page * pageSize),
      func(i) { sortedItems[page * pageSize + i] },
    );
    {
      items = paginatedItems;
      total;
      page;
      pageSize;
    };
  };

  public shared func addShoppingList(name : Text) : async ([ShoppingListResponse]) {
    Guards.requireShoppingListNotExists(name);
    let listId = getNextShoppingListIndex();
    shoppingLists.add(listId, { id = listId; name; items = [] });
    await getShoppingLists();
  };

  public shared func getShoppingLists() : async [ShoppingListResponse] {
    let lists = shoppingLists.values().toArray();
    let listsResponse = lists.map(
      func(list) {
        let itemsResponse = list.items.map(
          func(item) {
            let listItem = switch (listItems.get(item.id)) {
              case (null) { Runtime.trap("Item not found") };
              case (?l) { l };
            };
            {
              id = item.id;
              name = listItem.name;
              amount = item.amount;
              completed = item.completed;
            };
          }
        );
        { id = list.id; name = list.name; items = itemsResponse };
      }
    );
    listsResponse;
  };

  public shared func getShoppingList(listId : Nat) : async (ShoppingListResponse) {
    let list = await getShoppingLists();
    let listResponse = list.find(func(list) { list.id == listId });
    switch (listResponse) {
      case (null) { Runtime.trap("List not found") };
      case (?l) { l };
    };
  };

  public shared func cloneShoppingList(listId : Nat, newName : Text) : async (ShoppingList) {
    let list = switch (shoppingLists.get(listId)) {
      case (null) { Runtime.trap("List not found") };
      case (?l) { l };
    };
    let newListId = getNextShoppingListIndex();
    let newItems = list.items.map(
      func(item) {
        { id = item.id; amount = item.amount; completed = false };
      }
    );

    shoppingLists.add(
      newListId,
      {
        id = newListId;
        name = newName;
        items = newItems;
      },
    );
    await getShoppingList(newListId);
  };

  public shared func deleteShoppingLists(listIds : [Nat]) : async ([ShoppingListResponse]) {
    for (listId in listIds.values()) {
      shoppingLists.remove(listId);
    };
    await getShoppingLists();
  };

  public shared func addItemsToShoppingList(listId : Nat, shoppingListItems : [ShoppingListItem]) : async (ShoppingListResponse) {
    for (item in shoppingListItems.values()) {
      Guards.requireListItemExists(item.id);
      Guards.requireItemNotExistsInAList(item.id, listId);
    };

    let list = switch (shoppingLists.get(listId)) {
      case (null) { Runtime.trap("List not found") };
      case (?l) { l };
    };
    shoppingLists.add(listId, { id = list.id; name = list.name; items = list.items.concat(shoppingListItems) });
    await getShoppingList(listId);
  };

  public shared func removeItemFromShoppingList(listId : Nat, itemId : Nat) : async () {
    let list = switch (shoppingLists.get(listId)) {
      case (null) { Runtime.trap("List not found") };
      case (?l) { l };
    };

    let updatedItems = list.items.filter(
      func(item) { item.id != itemId }
    );

    shoppingLists.add(listId, { id = list.id; name = list.name; items = updatedItems });
  };

  public shared func editItemsInShoppingList(listId : Nat, items : [ShoppingListItem]) : async (ShoppingListResponse) {
    for (item in items.values()) {
      Guards.requireListItemExists(item.id);
      Guards.requireItemExistsInAList(item.id, listId);
    };

    let list = switch (shoppingLists.get(listId)) {
      case (null) { Runtime.trap("List not found") };
      case (?l) { l };
    };

    let updatedItems = items.map(
      func(item) {
        {
          id = item.id;
          amount = item.amount;
          completed = item.completed;
        };
      }
    );

    shoppingLists.add(listId, { id = list.id; name = list.name; items = updatedItems });
    await getShoppingList(listId);
  };

  public shared func completeItems(listId : Nat, itemIds : [Nat]) : async (ShoppingList) {
    let list = switch (shoppingLists.get(listId)) {
      case (null) { Runtime.trap("List not found") };
      case (?l) { l };
    };

    let updatedItems = list.items.map(
      func(item) {
        if (itemIds.find(func(id) { id == item.id }) != null) {
          { id = item.id; amount = item.amount; completed = true };
        } else {
          item;
        };
      }
    );

    shoppingLists.add(listId, { id = list.id; name = list.name; items = updatedItems });
    await getShoppingList(listId);
  };

  func getNextIndex() : Nat {
    index += 1;
    index;
  };

  func getNextShoppingListIndex() : Nat {
    shoppingListIndex += 1;
    shoppingListIndex;
  };

  module Guards {
    public func requireShoppingListNotExists(name : Text) : () {
      if (shoppingLists.values().toArray().find(func(list) { list.name == name }) != null) {
        Runtime.trap("List already exists");
      };
    };

    public func requireItemNotExists(name : Text) : () {
      if (listItems.values().toArray().find(func(item) { item.name == name }) != null) {
        Runtime.trap("Item already exists");
      };
    };

    public func requireListItemExists(id : Nat) : () {
      if (listItems.get(id) == null) { Runtime.trap("Item not found") };
    };

    public func requireShoppingListExists(id : Nat) : () {
      if (shoppingLists.get(id) == null) { Runtime.trap("List not found") };
    };

    public func requireItemNotExistsInAList(id : Nat, listId : Nat) : () {
      if (shoppingLists.get(listId) == null) { Runtime.trap("List not found") };
      let list = switch (shoppingLists.get(listId)) {
        case (null) { Runtime.trap("List not found") };
        case (?l) { l };
      };
      if (list.items.find(func(item) { item.id == id }) != null) {
        Runtime.trap("Item already exists in list");
      };
    };

    public func requireItemExistsInAList(id : Nat, listId : Nat) : () {
      if (shoppingLists.get(listId) == null) { Runtime.trap("List not found") };
      let list = switch (shoppingLists.get(listId)) {
        case (null) { Runtime.trap("List not found") };
        case (?l) { l };
      };
      if (list.items.find(func(item) { item.id == id }) == null) {
        Runtime.trap("Item not found in list");
      };
    };
  };
};
