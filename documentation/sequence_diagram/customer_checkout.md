![alt text](image-3.png)

```plantuml
@startuml
title Customer Checkout History
Actor customer
Entity web_app
Database database

group customer_checkout_history
activate web_app
    web_app --> customer:cart view
    customer -> web_app:tap checkout button
    activate database
        web_app -> database:POST api/v1/histories
        web_app -> database:GET api/v1/histories/{historyId}
        database --> web_app: history(attributes)
    deactivate database
    web_app --> customer:history detail view
deactivate web_app
end group
@enduml
```