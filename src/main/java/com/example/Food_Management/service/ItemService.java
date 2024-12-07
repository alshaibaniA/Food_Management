package com.example.Food_Management.service;

import com.example.Food_Management.model.Item;
import com.example.Food_Management.repository.ItemRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public Optional<Item> getItemById(Long id) {
        return itemRepository.findById(id);
    }

    public Item createItem(Item item) {
        return itemRepository.save(item);
    }
    public Item updateItemStatus(Long itemId, Boolean isDelete) {
        Item item = itemRepository.findById(itemId).orElse(null);
        if (item != null) {
            item.setDelete(isDelete);  // Make sure isDelete is a boolean value
            return itemRepository.save(item);
        }
        return null;  // Return null if the item is not found
    }



}
