package com.example.Food_Management.controller;

import com.example.Food_Management.model.Item;
import com.example.Food_Management.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")  // Allow frontend requests from localhost:3000
@RestController
@RequestMapping("/items")
public class ItemController {

    @Autowired
    private ItemService itemService;

    // Directory to store uploaded images
    private static final String UPLOAD_DIR = "src/main/resources/static/uploads/";

    // Get all items
    @GetMapping("")
    public List<Item> getAllItems() {
        List<Item> items = itemService.getAllItems();
        items.forEach(item -> System.out.println("Item: " + item.getItemName() + ", Is Deleted: " + item.isDelete()));
        return items;
    }

    // Get a specific item by ID
    @GetMapping("/{id}")
    public Item getItemById(@PathVariable Long id) {
        return itemService.getItemById(id).orElse(null);  // Return null if not found
    }

    // Create a new item with image upload
    @PostMapping("/add")
    public Item createItem(@RequestParam("file") MultipartFile file,
                           @RequestParam("itemName") String itemName,
                           @RequestParam("category") String category,
                           @RequestParam("price") double price) throws IOException {

        // Save the uploaded image to the server and get its file path
        String imagePath = saveImage(file);

        // Create a new Item object and set its properties
        Item item = new Item();
        item.setItemName(itemName);
        item.setCategory(category);
        item.setPrice(price);
        item.setImage(imagePath);  // Store the image path in the item

        // Save the item to the database
        return itemService.createItem(item);
    }
    @PutMapping("/update/{itemId}")
    public Item updateItemStatus(@PathVariable Long itemId, @RequestBody Map<String, Boolean> status) {
        if (status.containsKey("isDelete")) {
            Boolean isDelete = status.get("isDelete");  // Extract isDelete value from the map
            return itemService.updateItemStatus(itemId, isDelete);  // Pass the value to the service
        } else {
            throw new IllegalArgumentException("Missing 'isDelete' in request body");
        }


    }
    @PutMapping("/remove/{itemId}")
    public Item removeItem(@PathVariable Long itemId, @RequestBody Map<String, Boolean> status) {
        if (status.containsKey("isRemoved")) {
            Boolean isRemoved = status.get("isRemoved");  // Extract isRemoved value from the map
            return itemService.removeItem(itemId, isRemoved);  // Call service method to handle removal
        } else {
            throw new IllegalArgumentException("Missing 'isRemoved' in request body");
        }
    }




    // Helper method to save the uploaded image to the server
    private String saveImage(MultipartFile file) throws IOException {
        // Ensure the upload directory exists
        Path path = Paths.get(UPLOAD_DIR);
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }

        // Generate a unique file name and save the image
        String filename = file.getOriginalFilename();
        Path filePath = path.resolve(filename);
        file.transferTo(filePath);

        // Return the relative path to store in the database
        return filename;  // This can be changed to the full path if needed
    }
}
