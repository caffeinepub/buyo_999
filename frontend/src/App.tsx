import { useEffect, useState, useMemo, useCallback } from "react";
import { Start } from "./components/start";
import { List } from "./components/list";
import { Sublist } from "./components/sublist";
import {
  useAddShoppingList,
  useDeleteShoppingLists,
  useAvailableItems,
  useShoppingList,
  useShoppingLists,
  useAddAvailableItem,
  useAddShoppingListItem,
  useCompleteItem,
  useEditItem,
  useCloneShoppingList,
} from "./hooks/useQueries";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { Modal } from "./components/modal";
import { ModalCreateContent } from "./components/modal-create-content";
import { ModalAddContent } from "./components/modal-add-content";
import { useActor } from "./hooks/useActor";
import { getFooterMarkup, getHeaderMarkup, share } from "./utils";
import { ButtonType, Screen } from "./types";
import { ModalCloneContent } from "./components/modal-clone-content";
import { ModalDeleteContent } from "./components/modal-delete-content";
import { Loader } from "./components/loader";
import { useQueryClient } from "@tanstack/react-query";
import {
  ShoppingListItem,
  ShoppingList,
  ShoppingListItemResponse,
  ListItem,
} from "./backend";
import { useIsDesktop } from "./hooks/useIsDesktop";
import BgImage from "/assets/bg-x2.png";
import { Button } from "./components/button";
import { AddIcon, EditIcon, ShareIcon } from "./components/Icons";
import EmptyPict from "/assets/sublist-empty.png";

export const App = () => {
  const { actor, isFetching: isActorFetching } = useActor();
  const queryClient = useQueryClient();
  const isDesktop = useIsDesktop();

  const [editedItems, setEditedItems] = useState<ShoppingListItemResponse[]>(
    [],
  );

  const [newListName, setNewListName] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemAmount, setNewItemAmount] = useState<number | undefined>();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCloneModalOpen, setIsCloneModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isListEditMode, setIsListEditMode] = useState(false);
  const [isSublistEditMode, setIsSublistEditMode] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  const [screen, setScreen] = useState(Screen.START);
  const [listId, setListId] = useState<bigint | null>(null);
  const [listItemsToDelete, setListItemsToDelete] = useState<
    bigint | undefined
  >();

  const { data: lists, isFetching: isListsLoading } = useShoppingLists();
  const { data: list, isFetching: isListLoading } = useShoppingList(listId);
  const {
    mutateAsync: addList,
    isPending: addListLoading,
    error: addListError,
    reset: addListReset,
  } = useAddShoppingList();
  const { mutateAsync: clone, isPending: cloneLoading } =
    useCloneShoppingList();
  const { mutateAsync: deleteLists, isPending: removeListLoading } =
    useDeleteShoppingLists();
  const { data: availableItems, isFetching: isAvailableItemLoading } =
    useAvailableItems(newItemName);

  const { mutateAsync: addAvailableItem, isPending: addAvailableLoading } =
    useAddAvailableItem();
  const {
    mutateAsync: addShoppingItem,
    error: addShoppingItemError,
    reset: addShoppingItemReset,
  } = useAddShoppingListItem(listId);
  const { mutateAsync: completeItem } = useCompleteItem(listId);

  const { mutateAsync: editShoppingItem, isPending: editShoppingItemLoading } =
    useEditItem(listId);

  const filteredLists = useMemo(() => {
    if (!lists) return [];

    return [...lists].sort((a, b) => {
      const aEmpty = a.items.length === 0;
      const bEmpty = b.items.length === 0;

      if (aEmpty && bEmpty) return 0;
      if (aEmpty) return -1;
      if (bEmpty) return 1;

      const aCompleted = a.items.every(
        (item: ShoppingListItem) => item.completed,
      );
      const bCompleted = b.items.every(
        (item: ShoppingListItem) => item.completed,
      );

      return Number(aCompleted) - Number(bCompleted);
    });
  }, [lists]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get("id");

    if (idParam) {
      const found = lists?.find(
        (list: ShoppingList) => list.id === BigInt(idParam),
      );
      if (found === undefined || found === null) return;
      try {
        const idBigInt = BigInt(idParam);
        setListId(idBigInt);
        setScreen(Screen.SUBLIST);
      } catch (err) {
        console.warn("Invalid ID param in URL:", idParam);
      }
    }
  }, [lists]);

  useEffect(() => {
    if (!actor) return;

    actor.isInited().then((value: boolean) => {
      if (!value) {
        actor.init([]).then(() => {
          queryClient.invalidateQueries({ queryKey: ["shoppingLists"] });
        });
      }
    });
  }, [actor, queryClient]);

  const createList = useCallback(async () => {
    if (!newListName.trim()) return;

    const lists = await addList(newListName);
    setNewListName("");
    setIsCloneModalOpen(false);
    setIsCreateModalOpen(false);

    if (isDesktop && lists && lists.length > 0) {
      setListId(lists[lists.length - 1].id);
    }
  }, [newListName, addList, isDesktop, setListId]);

  const cloneList = useCallback(async () => {
    if (listId == null || !newListName.trim()) return;
    const cloned = await clone({ id: listId, name: newListName });
    setNewListName("");
    setIsCloneModalOpen(false);
    setIsCreateModalOpen(false);

    console.log(cloned);

    if (isDesktop && cloned) {
      setListId(cloned.id);
    }
  }, [newListName, addList, isDesktop, setListId]);

  const removeLists = useCallback(async () => {
    if (listItemsToDelete == null) return;

    await deleteLists([listItemsToDelete]);
    setIsDeleteModalOpen(false);
  }, [listItemsToDelete, deleteLists]);

  const addItem = useCallback(async () => {
    if (newItemAmount == null || newItemAmount === 0) return;

    let foundItem;

    if (
      !availableItems?.items.find((item: ListItem) => item.name === newItemName)
    ) {
      const newItem = await addAvailableItem(newItemName);
      foundItem = newItem;
    } else {
      foundItem = availableItems.items.find(
        (item: ListItem) => item.name === newItemName,
      );
    }

    if (foundItem == null || foundItem.id == null) return;

    await addShoppingItem([
      {
        id: foundItem.id,
        completed: false,
        amount: BigInt(newItemAmount),
      },
    ]);

    setNewItemAmount(undefined);
    setNewItemName("");
    setIsAddModalOpen(false);
  }, [
    newItemAmount,
    newItemName,
    availableItems,
    addAvailableItem,
    addShoppingItem,
  ]);

  useEffect(() => {
    if (
      isDesktop &&
      screen === Screen.LIST &&
      filteredLists?.length &&
      listId == null
    ) {
      const first = filteredLists[0];
      setListId(first.id);
      setScreen(Screen.SUBLIST);
    }
  }, [isDesktop, screen, filteredLists, listId]);

  const getMainMarkup = () => {
    if (isDesktop) {
      switch (screen) {
        case Screen.START:
          return <Start setScreen={setScreen} isLoading={isActorFetching} />;

        case Screen.LIST:
        case Screen.SUBLIST:
          return (
            <>
              {filteredLists?.length > 0 ? (
                <div
                  className="flex relative"
                  style={{ height: "calc(100vh - 96px)" }}
                >
                  <aside className="h-full w-[322px] pr-[30px] flex flex-col gap-5 pb-4 relative">
                    <div
                      className="overflow-y-auto"
                      style={{ maxHeight: "calc(100vh - 170px)" }}
                    >
                      <List
                        setScreen={setScreen}
                        setIsCloneModalOpen={setIsCloneModalOpen}
                        setIsDeleteModalOpen={setIsDeleteModalOpen}
                        setListId={setListId}
                        listId={isDesktop && listId}
                        setListItemsToDelete={setListItemsToDelete}
                        lists={filteredLists}
                        setCloneName={setNewListName}
                        isEditMode={isListEditMode}
                      />
                    </div>
                    {!isListEditMode && (
                      <div className="mt-auto">
                        <Button
                          btnType={ButtonType.SECONDARY}
                          text="Create new list"
                          onClick={() => setIsCreateModalOpen(true)}
                        />
                      </div>
                    )}
                  </aside>
                  <main
                    className={`z-[4] flex-1 pt-[20px] px-[30px] h-full flex flex-col gap-5 pb-4 relative rounded-[12px] ${isSublistEditMode ? "bg-[#EAE9E8]" : "bg-[#EAE9E8]"}`}
                  >
                    <div
                      className={`absolute backdrop-blur-lg bg-[#EAE9E8E5] left-0 top-0 w-full h-full rounded-[12px] ${isListEditMode ? "block" : "hidden"}`}
                    ></div>
                    <div className="font-bold text-[24px] leading-10 flex items-center justify-between">
                      <span>
                        {isSublistEditMode && <>Edit </>}
                        {list?.name}
                      </span>
                      <div
                        className={`flex bg-white rounded-[12px] ${isListEditMode ? "z-[-1]" : ""}`}
                      >
                        {isSublistEditMode ? (
                          <div
                            className={`w-[60px] relative h-10 flex items-center justify-center cursor-pointer bg-[#FFFFFFBF] hover:bg-white transition-all duration-200 ease-in-out rounded-[12px] select-none`}
                            onClick={() => {
                              editShoppingItem(editedItems);
                              setEditedItems([]);
                              setIsSublistEditMode(false);
                            }}
                          >
                            <span className="font-bold text-[#BD7760] text-[16px]">
                              Done
                            </span>
                          </div>
                        ) : (
                          <>
                            {!isCompleted && !isEmpty && (
                              <div
                                className={`w-10 relative h-10 flex items-center justify-center cursor-pointer bg-[#FFFFFFBF] hover:bg-white transition-all duration-200 ease-in-out rounded-[12px] select-none`}
                                onClick={() => {
                                  setIsSublistEditMode(true);
                                }}
                              >
                                <EditIcon />
                              </div>
                            )}
                            <div
                              className={`w-10 relative h-10 flex items-center justify-center cursor-pointer bg-[#FFFFFFBF] hover:bg-white transition-all duration-200 ease-in-out rounded-[12px] select-none ${!isCompleted && !isEmpty ? "before:content-[''] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-px before:bg-[#f0f0f0]" : ""}`}
                              onClick={() => share(listId)}
                            >
                              <ShareIcon />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div
                      className="overflow-y-auto"
                      style={{ maxHeight: "calc(100vh - 272px)" }}
                    >
                      <Sublist
                        list={list}
                        isEditMode={isSublistEditMode}
                        completeItem={completeItem}
                        editedItems={editedItems}
                        setEditedItems={setEditedItems}
                        isCompleted={isCompleted}
                        setIsCompleted={setIsCompleted}
                        setIsEmpty={setIsEmpty}
                        refetchLists={() =>
                          queryClient.invalidateQueries({
                            queryKey: ["shoppingLists"],
                          })
                        }
                      />
                    </div>
                    {!isSublistEditMode && !isCompleted && (
                      <div className="mt-auto">
                        <Button
                          icon={AddIcon}
                          btnType={ButtonType.PRIMARY}
                          text="Add new item"
                          onClick={() => setIsAddModalOpen(true)}
                        />
                      </div>
                    )}
                  </main>
                </div>
              ) : (
                <div className="h-full flex flex-col justify-center items-center gap-3">
                  <img src={EmptyPict} alt="Buyo empty" />
                  <p className="text-[#C1C3CA] leading-[22px]">
                    This list is empty.
                  </p>
                  <div className="mt-auto">
                    <Button
                      btnType={ButtonType.SECONDARY}
                      text="Create new list"
                      onClick={() => setIsCreateModalOpen(true)}
                      width={293}
                    />
                  </div>
                </div>
              )}
            </>
          );

        default:
          return <div>Page not found</div>;
      }
    }

    switch (screen) {
      case Screen.START:
        return <Start setScreen={setScreen} isLoading={isActorFetching} />;
      case Screen.LIST:
        return (
          <div
            className="overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 170px)" }}
          >
            <List
              setScreen={setScreen}
              setIsCloneModalOpen={setIsCloneModalOpen}
              setIsDeleteModalOpen={setIsDeleteModalOpen}
              setListId={setListId}
              setListItemsToDelete={setListItemsToDelete}
              lists={filteredLists}
              setCloneName={setNewListName}
              isEditMode={isListEditMode}
            />
          </div>
        );
      case Screen.SUBLIST:
        return (
          <div
            className="overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 170px)" }}
          >
            <Sublist
              list={list}
              isEditMode={isSublistEditMode}
              completeItem={completeItem}
              editedItems={editedItems}
              setEditedItems={setEditedItems}
              isCompleted={isCompleted}
              setIsCompleted={setIsCompleted}
              setIsEmpty={setIsEmpty}
              refetchLists={() =>
                queryClient.invalidateQueries({ queryKey: ["shoppingLists"] })
              }
            />
          </div>
        );
      default:
        return <div>Page not found</div>;
    }
  };

  const isInitialLoading =
    (!lists && isListsLoading) || (!list && isListLoading);

  const isAnyLoading =
    isInitialLoading ||
    isListsLoading ||
    isListLoading ||
    isActorFetching ||
    editShoppingItemLoading ||
    removeListLoading;

  return (
    <div
      className="m-auto px-[16px] py-[24px] h-full w-full relative"
      style={{
        backgroundImage: `url(${BgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {isAnyLoading && screen !== Screen.START && <Loader />}
      <div
        className={`absolute backdrop-blur-lg z-[3] bg-[#00000033] left-0 top-0 w-full h-full rounded-[12px] ${isSublistEditMode && isDesktop ? "block" : "hidden"}`}
      ></div>
      <Modal
        isOpen={isCreateModalOpen}
        submitButtontext="Create"
        onSubmit={() => createList()}
        disabled={!newListName || !!addListError || addListLoading}
        onClose={() => {
          setIsCreateModalOpen(false);
          setNewListName("");
          addListReset();
        }}
      >
        <ModalCreateContent
          error={Boolean(addListError)}
          value={newListName}
          setValue={(v) => {
            setNewListName(v);
            if (addListError) addListReset();
          }}
        />
      </Modal>
      <Modal
        isOpen={isCloneModalOpen}
        submitButtontext="Clone"
        onSubmit={() => {
          cloneList();
        }}
        disabled={!newListName || cloneLoading}
        onClose={() => {
          setIsCloneModalOpen(false);
          setNewListName("");
          addListReset();
        }}
      >
        <ModalCloneContent
          error={Boolean(addListError)}
          value={newListName}
          setValue={(v) => {
            setNewListName(v);
            if (addListError) addListReset();
          }}
        />
      </Modal>
      <Modal
        isOpen={isAddModalOpen}
        submitButtontext="Add"
        onSubmit={addItem}
        disabled={
          isAvailableItemLoading || newItemAmount == null || newItemAmount === 0
        }
        onClose={() => {
          setIsAddModalOpen(false);
          setNewItemName("");
          setNewItemAmount(undefined);
        }}
      >
        <ModalAddContent
          value={newItemName}
          amount={newItemAmount}
          setAmount={setNewItemAmount}
          title={list?.name}
          error={Boolean(addShoppingItemError)}
          items={availableItems}
          setValue={(v) => {
            setNewItemName(v);
            if (addShoppingItemError) addShoppingItemReset();
          }}
        />
      </Modal>
      <Modal
        isOpen={isDeleteModalOpen}
        isDeletion
        submitButtontext="Delete"
        onSubmit={removeLists}
        disabled={isAvailableItemLoading || addAvailableLoading}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setNewListName("");
        }}
      >
        <ModalDeleteContent />
      </Modal>
      <div className="h-full flex flex-col">
        <Header
          {...getHeaderMarkup(
            screen,
            isListEditMode,
            isSublistEditMode,
            setIsSublistEditMode,
            setIsListEditMode,
            listId,
            editedItems,
            setEditedItems,
            editShoppingItem,
            isDesktop,
            list?.name,
            isCompleted,
            (lists?.length ?? 0) === 0,
            isEmpty,
          )}
          backhandler={() => {
            setScreen(Screen.LIST);
            setIsCompleted(false);
            setIsEmpty(true);
          }}
          buttonBlurred={isSublistEditMode && isDesktop}
        />
        {getMainMarkup()}
        {!isDesktop && (
          <Footer
            buttons={getFooterMarkup(
              screen,
              setIsCreateModalOpen,
              setIsAddModalOpen,
              isListEditMode,
              isSublistEditMode,
              isCompleted,
              isEmpty,
            )}
          />
        )}
      </div>
    </div>
  );
};

export default App;
