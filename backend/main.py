from fastapi import FastAPI
from fastapi import APIRouter, HTTPException
from database import get_db_connection
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Insert row into SHIPMENT using 1 of the 2 preset insert queries
@app.post("/shipment/{num}")
def add_shipment(num: int):
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        match num:
            case 1:
                values = ("s2", "p3", 200, 0.006)
            case 2:
                values = ("s4", "p2", 100, 0.005)
            case _:
                raise HTTPException(status_code=400, detail="Invalid shipment number")

        cursor.execute("""
            INSERT INTO SHIPMENT (Sno, Pno, Qty, Price)
            VALUES (%s, %s, %s, %s)
        """, values)

        inserted = cursor.rowcount
        connection.commit()

        if inserted:
            return {"message": "Shipment successfully inserted."}
        else:
            return {"message": "Shipment already exists. No changes made."}

    except Exception:
        connection.rollback()
        raise HTTPException(status_code=500, detail="Unable to add shipment")

    finally:
        cursor.close()
        connection.close()


# Increase status of all suppliers by 10%
@app.patch("/supplier/status")
def increase_supplier_status():
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("""
            UPDATE SUPPLIER
            SET status = status * 1.1
        """)

        connection.commit()
        return {"message":f"Rows updated: {cursor.rowcount}"}
    except HTTPException:
        connection.rollback()
        raise HTTPException(
            status_code=500,
            detail="Unable to add shipment"
        )
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


# Get info for all suppliers
@app.get("/suppliers")
def get_suppliers():
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("""
            SELECT *
            FROM SUPPLIER
        """)
        rows = cursor.fetchall()
        connection.commit()
        return [
            {
                "Sno": row[0],
                "Sname": row[1],
                "Status": row[2],
                "City": row[3]
            }
            for row in rows
        ]
    except HTTPException:
        connection.rollback()
        raise HTTPException(
            status_code=500,
            detail="Unable to add shipment"
        )
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


# Get info for all suppliers that ship the passed in part
@app.get("/suppliers/ship/{pno}")
def get_suppliers_by_shipped_part(pno: str):
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("""
            SELECT *
            FROM SUPPLIER s
            WHERE EXISTS (
                SELECT sh.Sno
                FROM SHIPMENT sh
                WHERE s.Sno = sh.Sno AND
                sh.Pno = %s
            )
        """, (pno,))
        rows = cursor.fetchall()
        connection.commit()
        return [
            {
                "Sno": row[0],
                "Sname": row[1],
                "Status": row[2],
                "City": row[3]
            }
            for row in rows
        ]
    except HTTPException:
        connection.rollback()
        raise HTTPException(
            status_code=500,
            detail="Unable to add shipment"
        )
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()