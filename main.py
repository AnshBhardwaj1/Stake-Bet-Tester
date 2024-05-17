cash=1000
n1=float(input("Return of first bet: "))
n2=float(input("Return of second bet: "))
invest1=round((cash*n2)/(n1+n2), 2)
invest2=round(cash-invest1, 2)
profit1=round(invest1*n1, 2)
profit2=round(invest2*n2, 2)
print ("Investment of,",invest1,"at odds of",n1,"will return",profit1)
print ("Investment of,",invest2,"at odds of",n2,"will return",profit2)
print ("Total profit:",profit1+profit2)

if profit1>cash or profit2>cash:
    print ("Profitable bet")
else:
    print ("Loss making bet")