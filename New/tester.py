import math

cash = 1000
old_rates = [0, 0]
pinvested = [0, 0]
highest_observed_odds = [0, 0]
cashout_threshold = [0, 0]
overs_passed = False

team1 = "Team1"
team2 = "Team2"
#n1 = int(input("Enter odds for team1: "))
#n2 = int(input("Enter odds for team2: "))
n1=1.5
n2=2.5

if old_rates[0] == 0 and old_rates[1] == 0:
    invest1_raw = math.floor((cash / (1 + n1 / n2)) * 100) / 100
    invest2_raw = math.floor(cash - invest1_raw)
    factor = 500 / min(invest1_raw, invest2_raw)
    invest1 = math.floor(factor * invest1_raw)
    invest2 = 500 if invest1_raw < invest2_raw else math.floor(factor * invest2_raw)
    cash = invest1 + invest2
    pinvested = [invest1, invest2]
    old_rates = [n1, n2]
    print(f"Investment for {team1} = {invest1}")
    print(f"Investment for {team2} = {invest2}")



profit1 = math.floor(pinvested[0] * n1 * 100) / 100
profit2 = math.floor(pinvested[1] * n2 * 100) / 100
profit = math.floor((profit1 + profit2) / 2)
loss = math.floor(cash - profit)

print (f"Profit for {team1} = {profit1}")
print (f"Profit for {team2} = {profit2}")

loss = math.floor(cash - profit)
risk_percentage = round(loss / cash * 100, 2)

print (f"Risk % = {risk_percentage}")
